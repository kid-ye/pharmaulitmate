import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { ADMIN_EMAIL, BRAND_NAME } from '../../constants';
import { loginAdmin } from '../../api/client.js';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('admin-body');
    passwordRef.current?.focus();
    return () => document.body.classList.remove('admin-body');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginAdmin(email.trim(), password);
      localStorage.setItem('pharma-admin-token', data.token);
      onLogin(data.admin);
    } catch (err) {
      setError(err.message || 'Invalid admin email or password.');
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="login-image-panel">
        <img src="/images/hero-clinical-kits.svg" alt="" aria-hidden="true" />
        <div className="login-image-overlay">
          <span className="login-eyebrow">Admin Access</span>
          <h2>{BRAND_NAME}</h2>
          <p>Manage kits, orders &amp; inventory from one protected workspace.</p>
        </div>
      </div>

      <section className={`login-shell login-enter ${shake ? 'login-shake' : ''}`}>
        <form className="login-form-panel" onSubmit={handleSubmit} noValidate>
          <div>
            <span className="login-eyebrow">Secure Login</span>
            <h2>Welcome back</h2>
          </div>

          <div className="login-field">
            <label htmlFor="admin-email">Email</label>
            <span className="login-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                aria-describedby={error ? 'login-error-msg' : undefined}
                required
              />
            </span>
          </div>

          <div className="login-field">
            <label htmlFor="admin-password">Password</label>
            <span className="login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="admin-password"
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
                aria-describedby={error ? 'login-error-msg' : undefined}
                required
              />
              <button
                type="button"
                className="login-eye-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </div>

          {error && (
            <p id="login-error-msg" className="login-error" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <span className="login-spinner" /> : 'Enter Dashboard'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
