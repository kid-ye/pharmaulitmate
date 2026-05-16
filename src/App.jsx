import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { loadCart, syncCart } from "./api/client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function FadeUpObserver() {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, [pathname]);
  return null;
}

const CustomerLayout = ({ children, cart, toast, user, onLogout }) => (
  <div className="app-wrapper">
    <Navbar cartCount={cart.reduce((n, i) => n + i.qty, 0)} user={user} onLogout={onLogout} />
    <main>{children}</main>
    <Footer />
    {toast && (
      <div className="cart-toast">
        <span>✓</span> <strong>{toast}</strong> added to cart
      </div>
    )}
  </div>
);

const AdminRoute = () => {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => !!localStorage.getItem('pharma-admin-token'),
  );
  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    navigate('/admin', { replace: true });
  };
  const handleLogout = () => {
    localStorage.removeItem('pharma-admin-token');
    setIsAdminLoggedIn(false);
  };
  if (!isAdminLoggedIn) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
};

function App() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pharma-cart')) ?? []; }
    catch { return []; }
  });
  const [toast, setToast] = useState('');
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('pharma-user') || sessionStorage.getItem('pharma-user');
      const t = localStorage.getItem('pharma-user-token') || sessionStorage.getItem('pharma-user-token');
      if (u && t) {
        localStorage.setItem('pharma-user', u);
        localStorage.setItem('pharma-user-token', t);
      }
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });

  const syncCartToDb = (email, items) => {
    syncCart(email, items).catch(console.error);
  };

  const doAddToCart = (product, qty) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const updated = existing
        ? prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { id: product.id, name: product.name, category: product.category, price: product.price, image: product.image1, qty }];
      sessionStorage.setItem('pharma-cart', JSON.stringify(updated));
      if (user) syncCartToDb(user.email, updated);
      return updated;
    });
    setToast(product.name);
    setTimeout(() => setToast(''), 2500);
  };

  const addToCart = (product, qty) => {
    if (user) { doAddToCart(product, qty); return; }
    sessionStorage.setItem('pharma-pending-cart', JSON.stringify({ product, qty }));
    navigate('/signin', { state: { from: '/shop' } });
  };

  const handleAuth = async (u) => {
    setUser(u);
    localStorage.setItem('pharma-user', JSON.stringify(u));
    // Load persisted cart from DB
    let dbCart = [];
    try { dbCart = (await loadCart(u.email)).map(r => ({ id: r.product_id, name: r.name, category: r.category, price: Number(r.price), image: r.image, qty: r.qty })); } catch { /* offline fallback */ }
    // Merge with any pending item
    const pending = sessionStorage.getItem('pharma-pending-cart');
    if (pending) {
      try {
        const { product, qty } = JSON.parse(pending);
        const exists = dbCart.find((i) => i.id === product.id);
        if (exists) {
          dbCart = dbCart.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
        } else {
          dbCart = [...dbCart, { id: product.id, name: product.name, category: product.category, price: product.price, image: product.image1, qty }];
        }
      } catch { /* ignore */ }
      sessionStorage.removeItem('pharma-pending-cart');
    }
    setCart(dbCart);
    sessionStorage.setItem('pharma-cart', JSON.stringify(dbCart));
    if (dbCart.length) syncCart(u.email, dbCart).catch(console.error);
  };

  const handleLogout = () => {
    if (user) syncCart(user.email, cart).catch(console.error);
    localStorage.removeItem('pharma-user');
    localStorage.removeItem('pharma-user-token');
    sessionStorage.removeItem('pharma-cart');
    setUser(null);
    setCart([]);
    navigate('/');
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, qty } : i);
      sessionStorage.setItem('pharma-cart', JSON.stringify(updated));
      if (user) syncCartToDb(user.email, updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      sessionStorage.setItem('pharma-cart', JSON.stringify(updated));
      if (user) syncCartToDb(user.email, updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('pharma-cart');
    if (user) syncCartToDb(user.email, []);
  };

  return (
    <>
      <ScrollToTop />
      <FadeUpObserver />
      <Routes>
        <Route path="/admin" element={<AdminRoute />} />
        <Route
          path="/*"
          element={
            <CustomerLayout cart={cart} toast={toast} user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/signin" element={<SignIn onAuth={handleAuth} />} />
                <Route path="/profile" element={<Profile user={user} onUserUpdate={(u) => { setUser(u); localStorage.setItem('pharma-user', JSON.stringify(u)); }} />} />
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} onClearCart={clearCart} user={user} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </CustomerLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
