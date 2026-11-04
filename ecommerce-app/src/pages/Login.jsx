import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }
    try {
      setLoading(true);
      await login({ email, password });
      success('Welcome back to BharatBazaar!');
      navigate('/');
    } catch (err) {
      showError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoEmail, name) => {
    try {
      setDemoLoading(true);
      await demoLogin(demoEmail);
      success(`Logged in as ${name}!`);
      navigate('/');
    } catch (err) {
      showError('Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="auth-flag">🇮🇳</span>
          <h2>Welcome Back</h2>
          <p>Sign in to track orders, manage your cart &amp; claim festival coupons</p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="demo-accounts-box">
          <span className="demo-box-badge">⚡ Instant 1-Click Testing</span>
          <p>Try the store instantly with pre-loaded demo Indian accounts:</p>
          <div className="demo-btns-col">
            <button
              type="button"
              disabled={demoLoading}
              onClick={() => handleDemo('aarav@bharatbazaar.in', 'Aarav Sharma (Mumbai)')}
              className="btn-demo-quick"
            >
              👤 Sign in as Aarav Sharma (Mumbai • 400001)
            </button>
            <button
              type="button"
              disabled={demoLoading}
              onClick={() => handleDemo('priya@bharatbazaar.in', 'Priya Patel (Bengaluru)')}
              className="btn-demo-quick"
            >
              👤 Sign in as Priya Patel (Bengaluru • 560001)
            </button>
          </div>
        </div>

        <div className="auth-divider-line">
          <span>OR SIGN IN WITH EMAIL</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group-auth">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <div className="label-with-link">
              <label>Password</label>
              <span className="forgot-pass">Forgot Password?</span>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-auth-submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In to BharatBazaar →'}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <p>
            New to BharatBazaar? <Link to="/register">Create an Account</Link>
          </p>
          <div className="security-assure">
            <span>🔒 256-Bit SSL Secured • RBI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
