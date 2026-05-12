import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Cross, UserCog } from 'lucide-react';
import { BRAND_NAME, FREE_SHIPPING_THRESHOLD } from '../constants';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="header-container">
      <div className="announcement-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            <span>Free Shipping Above Rs.{FREE_SHIPPING_THRESHOLD}</span>
            <span>Pan India Delivery</span>
            <span>Medical Kits</span>
            <span>Clinic Ready</span>
            <span>Free Shipping Above Rs.{FREE_SHIPPING_THRESHOLD}</span>
            <span>Pan India Delivery</span>
            <span>Medical Kits</span>
            <span>Clinic Ready</span>
            <span>Free Shipping Above Rs.{FREE_SHIPPING_THRESHOLD}</span>
            <span>Pan India Delivery</span>
            <span>Medical Kits</span>
            <span>Clinic Ready</span>
          </div>
        </div>
      </div>

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="navbar-logo">
            {BRAND_NAME} <Cross size={20} className="logo-icon" />
          </Link>

          <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <Link to="/admin" className="admin-login-btn" aria-label="Admin login">
              <UserCog size={16} />
              <span>Admin</span>
            </Link>
            <button className="icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="cart-badge">0</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
