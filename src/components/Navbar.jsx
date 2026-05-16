import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Cross, User, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { BRAND_NAME, FREE_SHIPPING_THRESHOLD } from '../constants';
import './Navbar.css';

const Navbar = ({ cartCount = 0, user = null, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
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
            {user ? (
              <>
                <div className="notification-wrap" ref={notificationsRef}>
                  <button
                    type="button"
                    className="icon-btn notification-btn"
                    aria-label="Notifications"
                    aria-expanded={showNotifications}
                    onClick={() => {
                      setShowNotifications((v) => !v);
                      setShowUserMenu(false);
                    }}
                  >
                    <Bell size={19} />
                    <span className="notification-badge">1</span>
                  </button>
                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h3>Notifications</h3>
                        <span>1 new</span>
                      </div>
                      <div className="notification-item unread">
                        <span className="notification-dot" aria-hidden="true" />
                        <div>
                          <p>Your sample notification is ready.</p>
                          <small>Track orders, account updates, and offers here.</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="user-menu-wrap" ref={userMenuRef}>
                  <button
                    type="button"
                    className="user-pill"
                    onClick={() => {
                      setShowUserMenu((v) => !v);
                      setShowNotifications(false);
                    }}
                  >
                    <User size={15} />
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <p className="user-dropdown-email">{user.email}</p>
                      <Link to="/profile" className="user-dropdown-link" onClick={() => setShowUserMenu(false)}>
                        <LayoutDashboard size={14} /> My Account
                      </Link>
                      <button className="user-dropdown-logout" onClick={() => { onLogout(); setShowUserMenu(false); }}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/signin" className="admin-login-btn">
                <User size={15} />
                <span>Login / Register</span>
              </Link>
            )}
            <button className="icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="cart-badge">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
