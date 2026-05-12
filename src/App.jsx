import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";

// ScrollToTop Component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// FadeUpObserver for customer site animations
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
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [pathname]);
  return null;
}

// Customer Layout
const CustomerLayout = ({ children, cart, toast }) => {
  return (
    <div className="app-wrapper">
      <Navbar cartCount={cart.reduce((n, i) => n + i.qty, 0)} />
      <main>{children}</main>
      <Footer />
      {toast && (
        <div className="cart-toast">
          <span>✓</span> <strong>{toast}</strong> added to cart
        </div>
      )}
    </div>
  );
};

const AdminRoute = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => localStorage.getItem("pharmaultimate-admin-auth") === "true",
  );

  const handleLogin = () => {
    localStorage.setItem("pharmaultimate-admin-auth", "true");
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("pharmaultimate-admin-auth");
    setIsAdminLoggedIn(false);
  };

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

// Main App Component
function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('pharma-cart')) ?? [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState('');

  const saveCart = (updated) => {
    setCart(updated);
    sessionStorage.setItem('pharma-cart', JSON.stringify(updated));
  };

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const updated = existing
        ? prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { id: product.id, name: product.name, category: product.category, price: product.price, image: product.image1, qty }];
      sessionStorage.setItem('pharma-cart', JSON.stringify(updated));
      return updated;
    });
    setToast(product.name);
    setTimeout(() => setToast(''), 2500);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, qty } : i);
      sessionStorage.setItem('pharma-cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      sessionStorage.setItem('pharma-cart', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Router>
      <ScrollToTop />
      <FadeUpObserver />
      <Routes>
        {/* Admin Route - No Customer Layout */}
        <Route path="/admin/*" element={<AdminRoute />} />

        {/* Customer Routes - Wrapped in CustomerLayout */}
        <Route
          path="/*"
          element={
            <CustomerLayout cart={cart} toast={toast}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </CustomerLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
