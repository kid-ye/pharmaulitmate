import { Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../constants';
import './Cart.css';

const Cart = ({ cart, onUpdateQty, onRemove }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <div className="container text-center">
            <div className="breadcrumb">Home &rsaquo; Cart</div>
            <h1 className="cart-title">Your Cart</h1>
          </div>
        </div>
        <div className="cart-empty fade-up">
          <ShoppingBag size={48} strokeWidth={1.2} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="container text-center">
          <div className="breadcrumb">Home &rsaquo; Cart</div>
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtext">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <section className="section">
        <div className="container cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-row fade-up">
                <div className="cart-img-wrap">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-row-details">
                  <div className="cart-row-top">
                    <div>
                      <p className="cart-item-category">{item.category}</p>
                      <h3 className="cart-item-name">{item.name}</h3>
                    </div>
                    <button
                      className="cart-remove"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="cart-row-bottom">
                    <div className="cart-qty">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        &#43;
                      </button>
                    </div>
                    <span className="cart-item-price">
                      {CURRENCY_SYMBOL}{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary fade-up">
            <h2>Order Summary</h2>

            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="free-tag">Free</span> : `${CURRENCY_SYMBOL}${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="shipping-nudge">
                  Add {CURRENCY_SYMBOL}{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{CURRENCY_SYMBOL}{total.toLocaleString()}</span>
            </div>

            <button className="btn-primary full-width checkout-btn">
              Proceed to Checkout
            </button>
            <Link to="/shop" className="cart-continue">
              &larr; Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Cart;
