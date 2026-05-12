import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_TAGLINE, BRAND_EMAIL, BRAND_PHONE, BRAND_HOURS } from '../constants';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-charcoal">
      <div className="container footer-container fade-up">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            {BRAND_NAME}
          </Link>
          <p className="footer-desc">
            {BRAND_TAGLINE}
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Pinterest">Pinterest</a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Navigate</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop Collection</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/kits">Medical Kits</Link>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Help</h4>
          <Link to="/faq">FAQ</Link>
          <Link to="/shipping">Shipping & Returns</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Contact</h4>
          <p className="contact-info">{BRAND_EMAIL}</p>
          <p className="contact-info">{BRAND_PHONE}</p>
          <p className="contact-info">{BRAND_HOURS}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {BRAND_NAME}. Made in India.</p>
      </div>
    </footer>
  );
};

export default Footer;
