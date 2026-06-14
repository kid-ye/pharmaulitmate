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

// Calculate shipping for cart
// POST /api/shiprocket/calculate-shipping
router.post("/calculate-shipping", async (req, res) => {
  try {
    const { delivery_postcode, items } = req.body;
    if (!delivery_postcode || !items?.length) {
      return res.status(400).json({ error: 'delivery_postcode and items required' });
    }

    // Fetch products to get weight and origin pincode
    const productIds = items.map(i => i.product_id);
    const { rows } = await pool.query(
      'SELECT id, weight, origin_pincode FROM products WHERE id = ANY($1)',
      [productIds]
    );

    // Calculate total weight
    let totalWeight = 0;
    for (const item of items) {
      const product = rows.find(p => p.id === item.product_id);
      if (product) {
        totalWeight += (Number(product.weight) || 0.5) * (item.qty || 1);
      }
    }

    // Use first product's origin or default
    const pickupPostcode = rows[0]?.origin_pincode || '400001';

    // Call Shiprocket serviceability API
    const data = await shiprocketRequest(
      `/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${delivery_postcode}&weight=${totalWeight}&cod=0`
    );

    if (data.status === 200 && data.data?.available_courier_companies?.length > 0) {
      // Find cheapest courier
      const couriers = data.data.available_courier_companies;
      const cheapest = couriers.reduce((min, c) => 
        Number(c.rate) < Number(min.rate) ? c : min
      );

      res.json({
        success: true,
        shipping_cost: Number(cheapest.rate),
        courier_name: cheapest.courier_name,
        estimated_delivery: cheapest.estimated_delivery_date,
        total_weight: totalWeight
      });
    } else {
      res.json({ success: false, error: 'Shipping not available to this pincode' });
    }
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
