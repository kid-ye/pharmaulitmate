import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Leaf } from 'lucide-react';
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
    { name: 'Workshops', path: '/workshops' }
  ];

  return (
    <header className="header-container">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            <span>✦ Free Shipping Above ₹{FREE_SHIPPING_THRESHOLD}</span>
            <span>✦ Pan India Delivery</span>
            <span>✦ Handmade with Love</span>
            <span>✦ Made in India</span>
            {/* Duplicated for seamless loop */}
            <span>✦ Free Shipping Above ₹{FREE_SHIPPING_THRESHOLD}</span>
            <span>✦ Pan India Delivery</span>
            <span>✦ Handmade with Love</span>
            <span>✦ Made in India</span>
            <span>✦ Free Shipping Above ₹{FREE_SHIPPING_THRESHOLD}</span>
            <span>✦ Pan India Delivery</span>
            <span>✦ Handmade with Love</span>
            <span>✦ Made in India</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            {BRAND_NAME} <Leaf size={20} className="logo-icon" />
          </Link>

          {/* Center Nav Links */}
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

          {/* Right Icons */}
          <div className="navbar-actions">
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
