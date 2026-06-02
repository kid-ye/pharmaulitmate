import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import authRouter       from './routes/auth.js';
import usersRouter      from './routes/users.js';
import productsRouter   from './routes/products.js';
import ordersRouter     from './routes/orders.js';
import customersRouter  from './routes/customers.js';
import analyticsRouter  from './routes/analytics.js';
import reviewsRouter    from './routes/reviews.js';
import contactRouter    from './routes/contact.js';
import newsletterRouter from './routes/newsletter.js';
import wishlistRouter   from './routes/wishlist.js';
import cartRouter       from './routes/cart.js';
import shiprocketRouter from './routes/shiprocket.js';
import paymentRouter   from './routes/payment.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth',       authRouter);
app.use('/api/users',      usersRouter);
app.use('/api/products',   productsRouter);
app.use('/api/orders',     ordersRouter);
app.use('/api/customers',  customersRouter);
app.use('/api/analytics',  analyticsRouter);
app.use('/api/reviews',    reviewsRouter);
app.use('/api/contact',    contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/wishlist',   wishlistRouter);
app.use('/api/cart',       cartRouter);
app.use('/api/shiprocket', shiprocketRouter);
app.use('/api/payment',   paymentRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
