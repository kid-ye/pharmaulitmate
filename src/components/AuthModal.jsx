import { useState } from 'react';
import { X } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ onClose, onConfirm }) => {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('pharma-user', JSON.stringify(form));
    onConfirm(form);
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <h2>Sign in to continue</h2>
        <p>Enter your details to add items to your cart and place orders.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Email address"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <button type="submit" className="btn-primary full-width">Continue to Cart</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
