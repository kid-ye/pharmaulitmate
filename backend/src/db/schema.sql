CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL DEFAULT '',
  city          TEXT,
  segment       TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  sku            TEXT NOT NULL UNIQUE,
  category       TEXT NOT NULL,
  price          NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  stock          INT NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'In Stock',
  is_new         BOOLEAN NOT NULL DEFAULT FALSE,
  is_sold_out    BOOLEAN NOT NULL DEFAULT FALSE,
  image1         TEXT,
  image2         TEXT,
  image3         TEXT,
  image4         TEXT,
  image5         TEXT,
  weight         NUMERIC(10,2) DEFAULT 0.5,
  origin_pincode TEXT DEFAULT '400001',
  is_cod_eligible BOOLEAN DEFAULT TRUE,
  rating         NUMERIC(3,1) NOT NULL DEFAULT 0,
  reviews_count  INT NOT NULL DEFAULT 0,
  featured_order INT NOT NULL DEFAULT 0,
  description    TEXT,
  date_added     DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS orders (
  id             SERIAL PRIMARY KEY,
  order_ref      TEXT NOT NULL UNIQUE,
  customer_id    INT REFERENCES users(id),
  customer_name  TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subtotal       NUMERIC(10,2) NOT NULL,
  shipping       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total          NUMERIC(10,2) NOT NULL,
  status         TEXT NOT NULL DEFAULT 'Pending',
  sr_order_id    TEXT,
  sr_shipment_id TEXT,
  awb_code       TEXT,
  courier_name   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id                SERIAL PRIMARY KEY,
  order_id          INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        INT REFERENCES products(id) ON DELETE SET NULL,
  product_name      TEXT NOT NULL,
  qty               INT NOT NULL,
  price_at_purchase NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id            SERIAL PRIMARY KEY,
  product_id    INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id   INT REFERENCES users(id),
  customer_name TEXT NOT NULL,
  rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text          TEXT NOT NULL,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  product_id INT NOT NULL,
  name       TEXT NOT NULL,
  category   TEXT,
  price      NUMERIC(10,2) NOT NULL,
  image      TEXT,
  qty        INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist (
  session_id TEXT NOT NULL,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (session_id, product_id)
);

CREATE TABLE IF NOT EXISTS addresses (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label       TEXT NOT NULL DEFAULT 'Home',
  full_name   TEXT NOT NULL,
  phone       TEXT,
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  pincode     TEXT NOT NULL,
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subs (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_msgs (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  topic      TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
