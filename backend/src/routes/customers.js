import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/customers (admin)
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.city, u.segment, u.created_at,
         COUNT(o.id)::int             AS orders,
         COALESCE(SUM(o.total),0)::int AS spend
       FROM users u
       LEFT JOIN orders o ON o.customer_id = u.id
       GROUP BY u.id
       ORDER BY spend DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id (admin)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const custRes = await pool.query('SELECT id, name, email, city, segment, created_at FROM users WHERE id = $1', [req.params.id]);
    if (!custRes.rows[0]) return res.status(404).json({ error: 'Customer not found' });

    const ordersRes = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
          'product_name', oi.product_name, 'qty', oi.qty, 'price', oi.price_at_purchase
        )) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.customer_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.params.id]
    );
    res.json({ customer: custRes.rows[0], orders: ordersRes.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
