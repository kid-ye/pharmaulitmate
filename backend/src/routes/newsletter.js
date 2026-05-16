import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });
  try {
    await pool.query(
      `INSERT INTO newsletter_subs (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
