import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../constants";
import { createPaymentOrder, verifyPayment, placeOrder } from "../api/client";
import "./Checkout.css";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = ({ cart, onClearCart, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email ?? "",
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    phone: user?.phone ?? "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway. Check your connection.");

      // Step 1: create Razorpay order on backend
      const { order_id, amount, currency } = await createPaymentOrder(total);

      // Step 2: open Razorpay popup
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency,
          order_id,
          name: "Pharmaultimate",
          description: "Medical Kits Order",
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#6b1e35" },
          handler: async (response) => {
            try {
              // Step 3: verify signature on backend
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // Step 4: place order in DB + push to Shiprocket
              await placeOrder({
                customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                customer_email: formData.email,
                city: formData.city,
                items: cart.map((i) => ({ product_id: i.id, qty: i.qty })),
                shipping,
                shipping_address: {
                  line1: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  phone: formData.phone,
                },
                payment_id: response.razorpay_payment_id,
              });

              onClearCart();
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        });
        rzp.open();
      });

      setPlaced(true);
    } catch (err) {
      if (err.message !== "Payment cancelled") setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0 && !placed) {
    return (
      <div className="checkout-page empty-checkout">
        <h2>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="checkout-page empty-checkout">
        <h2>Order Placed!</h2>
        <p>Thank you for your order. We'll process and ship it shortly.</p>
        <button className="btn-primary" onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page section-container pad-nav">
      <div className="checkout-layout">
        {/* Left Side: Form */}
        <div className="checkout-form-section">
          <h2>Checkout</h2>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3>1. Customer Information</h3>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>2. Shipping Address</h3>
              <div className="input-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Flat/House No, Building, Street"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  value={formData.state}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  maxLength={6}
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="saveAddress"
                    checked={formData.saveAddress}
                    onChange={handleChange}
                  />
                  <span>Save this address for future checkouts</span>
                </label>
              </div>
            </div>

            {error && <p style={{ color: "red", fontSize: "13px", marginBottom: "0.5rem" }}>{error}</p>}
            <button type="submit" className="btn-primary full-width submit-btn" disabled={placing}>
              {placing ? "Opening Payment…" : `Pay ${CURRENCY_SYMBOL}${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  <span className="item-badge">{item.qty}</span>
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>
                    {CURRENCY_SYMBOL}
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>
                {CURRENCY_SYMBOL}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-tag">Free</span> : `${CURRENCY_SYMBOL}${shipping}`}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>
                {CURRENCY_SYMBOL}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
