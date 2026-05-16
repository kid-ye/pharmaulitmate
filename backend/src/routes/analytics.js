import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics/kpis
router.get('/kpis', requireAdmin, async (_req, res) => {
  try {
    const [revenueRes, ordersRes, productsRes, customersRes] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(total),0)::int AS total_revenue FROM orders WHERE status != 'Cancelled'`),
      pool.query(`SELECT COUNT(*)::int AS orders_today FROM orders WHERE created_at::date = CURRENT_DATE`),
      pool.query(`SELECT COUNT(*)::int AS active_products FROM products WHERE is_sold_out = FALSE`),
      pool.query(`SELECT COUNT(*)::int AS new_customers FROM users WHERE created_at >= NOW() - INTERVAL '30 days'`),
      pool.query(`SELECT COUNT(*)::int AS low_stock FROM products WHERE stock < 5 AND is_sold_out = FALSE`),
    ]);
    res.json({
      total_revenue:   revenueRes.rows[0].total_revenue,
      orders_today:    ordersRes.rows[0].orders_today,
      active_products: productsRes.rows[0].active_products,
      new_customers:   customersRes.rows[0].new_customers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/revenue — monthly aggregation for current year
router.get('/revenue', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT TO_CHAR(created_at, 'Mon') AS name,
              COALESCE(SUM(total),0)::int AS value
       FROM orders
       WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
         AND status != 'Cancelled'
       GROUP BY EXTRACT(MONTH FROM created_at), TO_CHAR(created_at, 'Mon')
       ORDER BY EXTRACT(MONTH FROM created_at)`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/categories — sales share by category
router.get('/categories', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.category AS name,
              SUM(oi.qty * oi.price_at_purchase)::int AS value
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       JOIN orders o ON o.id = oi.order_id
       WHERE o.status != 'Cancelled'
       GROUP BY p.category
       ORDER BY value DESC`
    );
    // Compute percentages
    const total = rows.reduce((s, r) => s + r.value, 0);
    const palette = ['#9E4060', '#2D6A4F', '#6B1E35', '#C8A98A', '#7A6460'];
    const result = rows.map((r, i) => ({
      name:  r.name,
      value: total ? Math.round((r.value / total) * 100) : 0,
      color: palette[i % palette.length],
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
