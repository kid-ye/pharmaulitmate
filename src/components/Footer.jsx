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
            <a
              href="https://www.instagram.com/womb_andbeyond/"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>Instagram</span>
            </a>
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
