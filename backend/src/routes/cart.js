import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

// GET /api/cart?email=
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  try {
    const { rows } = await pool.query(
      'SELECT * FROM cart WHERE email = $1 ORDER BY updated_at ASC',
      [email]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart/sync — replace entire cart for an email
router.post('/sync', async (req, res) => {
  const { email, items } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM cart WHERE email = $1', [email]);
    for (const item of (items ?? [])) {
      await client.query(
        `INSERT INTO cart (email, product_id, name, category, price, image, qty)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [email, item.id, item.name, item.category ?? null, item.price, item.image ?? null, item.qty]
      );
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
