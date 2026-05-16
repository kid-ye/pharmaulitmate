import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';
import { shiprocketRequest } from '../services/shiprocket.js';

const router = Router();

// POST /api/orders — place order from cart
router.post('/', async (req, res) => {
  const { customer_name, customer_email, city, items, shipping } = req.body;
  if (!customer_name || !customer_email || !items?.length) {
    return res.status(400).json({ error: 'customer_name, customer_email and items are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Upsert user
    const custRes = await client.query(
      `INSERT INTO users (name, email, city)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [customer_name, customer_email, city || null]
    );
    const customerId = custRes.rows[0].id;

    // Validate stock and compute subtotal
    let subtotal = 0;
    for (const item of items) {
      const { rows } = await client.query(
        'SELECT price, stock, is_sold_out FROM products WHERE id = $1', [item.product_id]
      );
      const product = rows[0];
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.is_sold_out || product.stock < item.qty) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
      subtotal += product.price * item.qty;
    }

    const shippingFee = shipping ?? (subtotal >= 500 ? 0 : 60);
    const total = subtotal + shippingFee;

    // Generate order ref
    const countRes = await client.query('SELECT COUNT(*) FROM orders');
    const orderRef = `EKM-${1000 + Number(countRes.rows[0].count) + 1}`;

    // Insert order
    const orderRes = await client.query(
      `INSERT INTO orders (order_ref, customer_id, customer_name, customer_email, subtotal, shipping, total, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'Pending') RETURNING *`,
      [orderRef, customerId, customer_name, customer_email, subtotal, shippingFee, total]
    );
    const order = orderRes.rows[0];

    // Insert order items and decrement stock
    for (const item of items) {
      const { rows } = await client.query('SELECT price, name FROM products WHERE id = $1', [item.product_id]);
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, qty, price_at_purchase)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.id, item.product_id, rows[0].name, item.qty, rows[0].price]
      );
      await client.query(
        `UPDATE products SET
           stock = stock - $1,
           status = CASE WHEN stock - $1 = 0 THEN 'Out of Stock'
                         WHEN stock - $1 < 5  THEN 'Low Stock'
                         ELSE 'In Stock' END,
           is_sold_out = CASE WHEN stock - $1 = 0 THEN TRUE ELSE FALSE END
         WHERE id = $2`,
        [item.qty, item.product_id]
      );
    }

    await client.query('COMMIT');

    // Push to Shiprocket asynchronously (don't block the response)
    pushToShiprocket(order, items, req.body).catch(err =>
      console.error('Shiprocket push failed for order', order.order_ref, err.message)
    );

    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// GET /api/orders (admin)
router.get('/', requireAdmin, async (req, res) => {
  const { status, sort = 'created_at', dir = 'desc', page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const values = [];
  const conditions = [];

  if (status) {
    values.push(status);
    conditions.push(`o.status = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const safeSort = ['created_at', 'total', 'status', 'order_ref'].includes(sort) ? sort : 'created_at';
  const safeDir  = dir === 'asc' ? 'ASC' : 'DESC';

  try {
    const countRes = await pool.query(`SELECT COUNT(*) FROM orders o ${where}`, values);
    values.push(Number(limit), offset);
    const { rows } = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
          'product_name', oi.product_name, 'qty', oi.qty, 'price', oi.price_at_purchase
        )) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${where}
       GROUP BY o.id
       ORDER BY o.${safeSort} ${safeDir}
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    res.json({ orders: rows, total: Number(countRes.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id (admin)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
          'product_name', oi.product_name, 'qty', oi.qty, 'price', oi.price_at_purchase
        )) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id::text = $1 OR o.order_ref = $1
       GROUP BY o.id`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// --- Shiprocket push (fire-and-forget) ---
async function pushToShiprocket(order, items, body) {
  const { customer_name, customer_email, shipping_address } = body;
  if (!shipping_address) return; // skip if no address provided

  // Build order items for Shiprocket
  const srItems = items.map(i => ({
    name: i.name,
    sku: `SKU-${i.product_id}`,
    units: i.qty,
    selling_price: i.price,
  }));

  const payload = {
    order_id: order.order_ref,
    order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    pickup_location: 'Primary',
    billing_customer_name: customer_name,
    billing_address: shipping_address.line1,
    billing_address_2: shipping_address.line2 || '',
    billing_city: shipping_address.city,
    billing_pincode: shipping_address.pincode,
    billing_state: shipping_address.state,
    billing_country: 'India',
    billing_email: customer_email,
    billing_phone: shipping_address.phone || '9999999999',
    shipping_is_billing: true,
    order_items: srItems,
    payment_method: 'Prepaid',
    sub_total: Number(order.subtotal),
    length: 10, breadth: 10, height: 10, weight: 0.5,
  };

  const srRes = await shiprocketRequest('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  await pool.query(
    `UPDATE orders SET sr_order_id=$1, sr_shipment_id=$2 WHERE id=$3`,
    [String(srRes.order_id), String(srRes.shipment_id), order.id]
  );
}
