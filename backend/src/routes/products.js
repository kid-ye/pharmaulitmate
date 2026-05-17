import { Router } from "express";
import pool from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

// POST /api/products/upload (admin) — upload up to 5 images, returns URLs
router.post("/upload", requireAdmin, upload.array("images", 5), (req, res) => {
  if (!req.files?.length)
    return res.status(400).json({ error: "No files uploaded" });
  res.json({ urls: req.files.map((f) => `/uploads/${f.filename}`) });
});

// GET /api/products?category=&sort=&page=&limit=
router.get("/", async (req, res) => {
  const { category, sort = "featured", page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const conditions = [];
  const values = [];

  if (category && category !== "All") {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderMap = {
    featured: "featured_order DESC",
    newest: "date_added DESC",
    "price-asc": "price ASC",
    "price-desc": "price DESC",
  };
  const orderBy = orderMap[sort] ?? "featured_order DESC";

  try {
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM products ${where}`,
      values,
    );
    const total = Number(countRes.rows[0].count);

    values.push(Number(limit), offset);
    const { rows } = await pool.query(
      `SELECT * FROM products ${where} ORDER BY ${orderBy}
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    res.json({
      products: rows,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/featured — for home page (top 6)
router.get("/featured", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE is_sold_out = FALSE ORDER BY featured_order DESC LIMIT 6",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (admin)
router.post("/", requireAdmin, async (req, res) => {
  const { name, sku, category, price, original_price, stock, status, is_new, image1, image2, image3, image4, image5, description } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, sku, category, price, original_price, stock, status, is_new, image1, image2, image3, image4, image5, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [name, sku, category, price, original_price || null, stock, status || "In Stock", is_new || false, image1, image2, image3 || null, image4 || null, image5 || null, description],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id (admin)
router.put("/:id", requireAdmin, async (req, res) => {
  const { name, price, original_price, stock, status, is_new, is_sold_out, description, featured_order } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE products SET
        image1 = $1,
        image2 = $2,
        image3 = $3,
        image4 = $4,
        image5 = $5,
        name = COALESCE($6, name),
        price = COALESCE($7, price),
        original_price = COALESCE($8, original_price),
        stock = COALESCE($9, stock),
        status = COALESCE($10, status),
        is_new = COALESCE($11, is_new),
        is_sold_out = COALESCE($12, is_sold_out),
        description = COALESCE($13, description),
        featured_order = COALESCE($14, featured_order)
       WHERE id = $15 RETURNING *`,
      [req.body.image1, req.body.image2, req.body.image3, req.body.image4, req.body.image5, name, price, original_price, stock, status, is_new, is_sold_out, description, featured_order, req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM products WHERE id = $1",
      [req.params.id],
    );
    if (!rowCount) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
