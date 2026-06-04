import { useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_EMAIL, BRAND_HOURS, BRAND_PHONE } from '../constants';
import { sendContact } from '../api/client';
import './InfoPages.css';

const contactMethods = [
  { icon: Mail, label: 'Email', value: BRAND_EMAIL },
  { icon: Phone, label: 'Phone', value: BRAND_PHONE },
  { icon: Clock, label: 'Hours', value: BRAND_HOURS },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendContact(form);
      setStatus('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(err.message);
    }
  };

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
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input type="text" name="name" placeholder="Your name" required value={form.name} onChange={handleChange} />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required value={form.email} onChange={handleChange} />
              </label>
              <label>
                Message
                <textarea name="message" rows="5" placeholder="Tell us what you need..." required value={form.message} onChange={handleChange}></textarea>
              </label>
              {status && <p style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '0.5rem' }}>{status}</p>}
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
