import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import AdminDashboard from './pages/admin/Dashboard';

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
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [pathname]);
  return null;
}

// Customer Layout
const CustomerLayout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <ScrollToTop />
      <FadeUpObserver />
      <Routes>
        {/* Admin Route - No Customer Layout */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        {/* Customer Routes - Wrapped in CustomerLayout */}
        <Route path="/*" element={
          <CustomerLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
            </Routes>
          </CustomerLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
