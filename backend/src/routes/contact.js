import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, topic, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO contact_msgs (name, email, topic, message) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, topic || null, message]
    );
    res.status(201).json({ success: true, id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact (admin)
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contact_msgs ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
