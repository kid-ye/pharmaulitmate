import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Creates a Razorpay order — called before opening the payment popup
router.post('/create-order', async (req, res) => {
  const { amount } = req.body; // amount in rupees
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });
    res.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// POST /api/payment/verify
// Verifies Razorpay signature after payment — must pass before placing order
router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' });
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  res.json({ verified: true });
});

export default router;
