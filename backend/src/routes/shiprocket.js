import { Router } from "express";
import pool from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";
import { getToken, shiprocketRequest } from "../services/shiprocket.js";

const router = Router();

// Test auth — GET /api/shiprocket/ping
router.get("/ping", requireAdmin, async (_req, res) => {
  try {
    const token = await getToken();
    res.json({ ok: true, token_preview: token.slice(0, 40) + "…" });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 3 — Serviceability (public so customers can check on product page)
// GET /api/shiprocket/serviceability?pickup_postcode=&delivery_postcode=&weight=&cod=
router.get("/serviceability", async (req, res) => {
  try {
    const qs = new URLSearchParams(req.query).toString();
    const data = await shiprocketRequest(`/courier/serviceability/?${qs}`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 4 — Create order
// POST /api/shiprocket/orders
router.post("/orders", requireAdmin, async (req, res) => {
  try {
    const data = await shiprocketRequest("/orders/create/adhoc", {
      method: "POST",
      body: JSON.stringify(req.body),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 5 — Assign AWB
// POST /api/shiprocket/awb
router.post("/awb", requireAdmin, async (req, res) => {
  try {
    const data = await shiprocketRequest("/courier/assign/awb", {
      method: "POST",
      body: JSON.stringify(req.body),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 6 — Generate pickup
// POST /api/shiprocket/pickup
router.post("/pickup", requireAdmin, async (req, res) => {
  try {
    const data = await shiprocketRequest("/courier/generate/pickup", {
      method: "POST",
      body: JSON.stringify(req.body),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 7 — Generate manifest
// POST /api/shiprocket/manifests/generate
router.post("/manifests/generate", requireAdmin, async (req, res) => {
  try {
    const data = await shiprocketRequest("/manifests/generate", {
      method: "POST",
      body: JSON.stringify(req.body),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 8 — Print manifest (PDF url)
// POST /api/shiprocket/manifests/print
router.post("/manifests/print", requireAdmin, async (req, res) => {
  try {
    const data = await shiprocketRequest("/manifests/print", {
      method: "POST",
      body: JSON.stringify(req.body),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 9 — Generate label (PDF url)
// POST /api/shiprocket/label
router.post("/label", requireAdmin, async (req, res) => {
  try {
    const data = await shiprocketRequest("/courier/generate/label", {
      method: "POST",
      body: JSON.stringify(req.body),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 10 — Print invoice (PDF url)
// POST /api/shiprocket/invoice
router.post("/invoice", requireAdmin, async (req, res) => {
  try {
    const data = await shiprocketRequest("/orders/print/invoice", {
      method: "POST",
      body: JSON.stringify(req.body),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Step 11 — Track by AWB
// GET /api/shiprocket/track/:awb
router.get("/track/:awb", async (req, res) => {
  try {
    const data = await shiprocketRequest(
      `/courier/track/awb/${req.params.awb}`,
    );
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Webhook — POST /api/shiprocket/webhook (called by Shiprocket on status change)
router.post("/webhook", async (req, res) => {
  try {
    const { awb, current_status, shipment_status, courier_name } = req.body;
    if (!awb) return res.sendStatus(200);

    const statusMap = {
      'Delivered': 'Delivered',
      'Shipped': 'Shipped',
      'In Transit': 'Shipped',
      'Out For Delivery': 'Shipped',
      'Cancelled': 'Cancelled',
      'RTO': 'Cancelled',
      'RTO Delivered': 'Cancelled',
    };
    const mapped = statusMap[current_status] || statusMap[shipment_status];

    if (mapped) {
      await pool.query(
        `UPDATE orders SET status=$1 ${courier_name ? ', courier_name=$3' : ''} WHERE awb_code=$2`,
        courier_name ? [mapped, String(awb), courier_name] : [mapped, String(awb)]
      );
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.sendStatus(200); // always 200 to Shiprocket
  }
});

export default router;
