import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENCY_SYMBOL } from "../constants";
import "./Checkout.css";

const Checkout = ({ cart, onClearCart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implementation for saving order and checkout to come
    alert(
      "Order details logged temporarily. Implementation for Shiprocket coming soon.",
    );
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page empty-checkout">
        <h2>Your cart is empty</h2>
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

            <button type="submit" className="btn-primary full-width submit-btn">
              Continue to Shipping
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
                  <img src={item.image1} alt={item.name} />
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
              <span>Calculated at next step</span>
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
