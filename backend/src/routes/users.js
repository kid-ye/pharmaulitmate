import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

const router = Router();

const requireUser = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows[0])
      return res.status(409).json({ error: 'An account with this email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email, city, segment',
      [name.trim(), email.toLowerCase(), hash]
    );
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, city: user.city, segment: user.segment } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/profile
router.get('/profile', requireUser, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, city, segment, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', requireUser, async (req, res) => {
  const { name, city, phone } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users SET
        name  = COALESCE($1, name),
        city  = COALESCE($2, city),
        phone = COALESCE($3, phone)
       WHERE id = $4 RETURNING id, name, email, city, phone, segment`,
      [name || null, city || null, phone || null, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/password
router.put('/password', requireUser, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ error: 'current_password and new_password are required' });
  if (new_password.length < 6)
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  try {
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (!(await bcrypt.compare(current_password, rows[0].password_hash)))
      return res.status(401).json({ error: 'Current password is incorrect' });
    const hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/orders
router.get('/orders', requireUser, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
          'product_name', oi.product_name, 'qty', oi.qty, 'price', oi.price_at_purchase, 'product_id', oi.product_id
        ) ORDER BY oi.id) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.customer_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/addresses
router.get('/addresses', requireUser, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/addresses
router.post('/addresses', requireUser, async (req, res) => {
  const { label, full_name, phone, line1, line2, city, state, pincode, is_default } = req.body;
  if (!full_name || !line1 || !city || !state || !pincode)
    return res.status(400).json({ error: 'full_name, line1, city, state and pincode are required' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (is_default) await client.query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [req.user.id]);
    const { rows } = await client.query(
      `INSERT INTO addresses (user_id, label, full_name, phone, line1, line2, city, state, pincode, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.id, label || 'Home', full_name, phone || null, line1, line2 || null, city, state, pincode, is_default ?? false]
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

// PUT /api/users/addresses/:id
router.put('/addresses/:id', requireUser, async (req, res) => {
  const { label, full_name, phone, line1, line2, city, state, pincode, is_default } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (is_default) await client.query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [req.user.id]);
    const { rows } = await client.query(
      `UPDATE addresses SET
        label = COALESCE($1, label), full_name = COALESCE($2, full_name), phone = COALESCE($3, phone),
        line1 = COALESCE($4, line1), line2 = COALESCE($5, line2), city = COALESCE($6, city),
        state = COALESCE($7, state), pincode = COALESCE($8, pincode), is_default = COALESCE($9, is_default)
       WHERE id = $10 AND user_id = $11 RETURNING *`,
      [label, full_name, phone, line1, line2, city, state, pincode, is_default, req.params.id, req.user.id]
    );
    await client.query('COMMIT');
    if (!rows[0]) return res.status(404).json({ error: 'Address not found' });
    res.json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// DELETE /api/users/addresses/:id
router.delete('/addresses/:id', requireUser, async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Address not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
