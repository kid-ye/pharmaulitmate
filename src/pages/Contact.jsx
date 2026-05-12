import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_EMAIL, BRAND_HOURS, BRAND_PHONE } from '../constants';
import './InfoPages.css';

const contactMethods = [
  { icon: Mail, label: 'Email', value: BRAND_EMAIL },
  { icon: Phone, label: 'Phone', value: BRAND_PHONE },
  { icon: Clock, label: 'Hours', value: BRAND_HOURS },
];

const Contact = () => {
  return (
    <div className="info-page">
      <section className="info-hero contact-hero">
        <div className="container info-hero-grid">
          <div className="info-hero-copy fade-up">
            <span className="breadcrumb">Home &rsaquo; Contact</span>
            <h1>Need help choosing the right kit?</h1>
            <p>
              Tell us what you are preparing for: home care, clinic restock, workplace safety, travel, or
              emergency readiness. We will help you find the right medical components.
            </p>
          </div>
          <div className="info-hero-media fade-up">
            <img src="/images/about-clinical-team.svg" alt="Medical kits prepared for delivery" />
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container contact-grid">
          <div className="contact-panel fade-up">
            <span className="eyebrow">Contact Us</span>
            <h2>Send a message</h2>
            <form className="contact-form">
              <label>
                Name
                <input type="text" name="name" placeholder="Your name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label>
                Topic
                <select name="topic" defaultValue="Medical kit guidance">
                  <option>Medical kit guidance</option>
                  <option>Bulk clinic order</option>
                  <option>Workplace safety supplies</option>
                  <option>Shipping support</option>
                </select>
              </label>
              <label>
                Message
                <textarea name="message" rows="5" placeholder="Tell us what you need..." required></textarea>
              </label>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>

          <aside className="contact-details fade-up">
            <div className="detail-card location-card">
              <MapPin size={24} />
              <h3>Support from India</h3>
              <p>Pan India delivery for medical kits, PPE packs, diagnostic components, and restock bundles.</p>
            </div>

            {contactMethods.map(({ icon: Icon, label, value }) => (
              <div className="detail-row" key={label}>
                <div className="detail-icon"><Icon size={20} /></div>
                <div>
                  <span>{label}</span>
                  <p>{value}</p>
                </div>
              </div>
            ))}

            <div className="detail-card">
              <MessageCircle size={24} />
              <h3>Quick buying help</h3>
              <p>Share your use case and quantity. We can suggest a compact kit, refill pack, or clinic bundle.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Contact;
