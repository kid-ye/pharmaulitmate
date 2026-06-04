import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

// All wishlist routes require a session_id header
const getSession = (req, res) => {
  const sid = req.headers['x-session-id'];
  if (!sid) { res.status(400).json({ error: 'x-session-id header required' }); return null; }
  return sid;
};

// GET /api/wishlist
router.get('/', async (req, res) => {
  const sid = getSession(req, res);
  if (!sid) return;
  try {
    const { rows } = await pool.query(
      `SELECT w.product_id, p.name, p.price, p.original_price, p.image1, p.image2, p.is_sold_out
       FROM wishlist w
       JOIN products p ON p.id = w.product_id
       WHERE w.session_id = $1
       ORDER BY w.added_at DESC`,
      [sid]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wishlist/:productId
router.post('/:productId', async (req, res) => {
  const sid = getSession(req, res);
  if (!sid) return;
  try {
    await pool.query(
      `INSERT INTO wishlist (session_id, product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [sid, req.params.productId]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', async (req, res) => {
  const sid = getSession(req, res);
  if (!sid) return;
  try {
    await pool.query(
      'DELETE FROM wishlist WHERE session_id = $1 AND product_id = $2',
      [sid, req.params.productId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
