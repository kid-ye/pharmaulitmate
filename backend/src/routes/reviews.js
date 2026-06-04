import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/reviews?productId=
router.get('/', async (req, res) => {
  const { productId } = req.query;
  const values = [];
  const conditions = [];
  if (productId) {
    values.push(productId);
    conditions.push(`r.product_id = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  try {
    const { rows } = await pool.query(
      `SELECT r.*, p.name AS product_name
       FROM reviews r
       JOIN products p ON p.id = r.product_id
       ${where}
       ORDER BY r.created_at DESC`,
      values
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews
router.post('/', async (req, res) => {
  const { product_id, customer_name, rating, text } = req.body;
  if (!product_id || !customer_name || !rating || !text) {
    return res.status(400).json({ error: 'product_id, customer_name, rating and text are required' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO reviews (product_id, customer_name, rating, text) VALUES ($1,$2,$3,$4) RETURNING *`,
      [product_id, customer_name, rating, text]
    );
    await client.query(
      `UPDATE products SET
         reviews_count = reviews_count + 1,
         rating = (SELECT ROUND(AVG(rating)::numeric,1) FROM reviews WHERE product_id = $1)
       WHERE id = $1`,
      [product_id]
    );
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PATCH /api/reviews/:id/feature (admin)
router.patch('/:id/feature', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE reviews SET is_featured = NOT is_featured WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Review not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
