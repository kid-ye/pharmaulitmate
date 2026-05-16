import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { BRAND_NAME } from '../constants';
import { registerUser, loginUser } from '../api/client';
import './SignIn.css';

const SignIn = ({ onAuth }) => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? '/';

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'register' && form.name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = tab === 'register'
        ? await registerUser(form.name.trim(), form.email.trim(), form.password)
        : await loginUser(form.email.trim(), form.password);

      sessionStorage.setItem('pharma-user', JSON.stringify(data.user));
      localStorage.setItem('pharma-user', JSON.stringify(data.user));
      localStorage.setItem('pharma-user-token', data.token);
      onAuth(data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-brand">{BRAND_NAME}</div>
        <h1>{tab === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="signin-sub">
          {tab === 'login'
            ? 'Sign in to manage your orders and cart.'
            : 'Join us to start shopping medical kits.'}
        </p>

        <div className="signin-tabs">
          <button
            className={tab === 'login' ? 'active' : ''}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={tab === 'register' ? 'active' : ''}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {tab === 'register' && (
            <label>
              Full Name
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                required
                value={form.name}
                onChange={handleChange}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Password
            <span className="pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Min. 6 characters"
                required
                value={form.password}
                onChange={handleChange}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((v) => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {error && <p className="signin-error">{error}</p>}

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Please wait…' : (tab === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="signin-switch">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}>
            {tab === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
