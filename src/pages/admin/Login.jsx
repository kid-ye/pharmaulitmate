import { useEffect, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { ADMIN_EMAIL, BRAND_NAME } from '../../constants';
import './Login.css';

const ADMIN_PASSWORD = 'admin123';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
      return;
    }

    setError('Invalid admin email or password.');
  };

  return (
    <main className="admin-login-page">
      <section className="login-shell">
        <div className="login-brand-panel">
          <div className="login-mark">
            <ShieldCheck size={28} />
          </div>
          <span className="login-eyebrow">Admin Access</span>
          <h1>{BRAND_NAME} dashboard</h1>
          <p>
            Sign in to manage medical kits, orders, inventory, and customer support from one protected workspace.
          </p>
          <div className="login-hint">
            <span>Demo email</span>
            <strong>{ADMIN_EMAIL}</strong>
            <span>Password</span>
            <strong>{ADMIN_PASSWORD}</strong>
          </div>
        </div>

        <form className="login-form-panel" onSubmit={handleSubmit}>
          <div>
            <span className="login-eyebrow">Secure Login</span>
            <h2>Welcome back</h2>
          </div>

          <label className="login-field">
            Email
            <span className="login-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </span>
          </label>

          <label className="login-field">
            Password
            <span className="login-input-wrap">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
                required
              />
            </span>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit">
            Enter Dashboard
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
