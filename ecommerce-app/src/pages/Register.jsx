import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { INDIAN_STATES } from '../utils/indianUtils';
import { pincodeAPI } from '../services/api';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    pincode: '',
    city: '',
    state: 'Maharashtra'
  });
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const { register } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: val }));

    if (val.length === 6) {
      try {
        setPincodeLoading(true);
        const res = await pincodeAPI.lookup(val);
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            city: res.data.city || prev.city,
            state: res.data.state || prev.state
          }));
          info(`Auto-detected: ${res.data.city}, ${res.data.state}`);
        }
      } catch (err) {}
      finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await register({
        ...formData,
        phone: formData.phone ? `+91 ${formData.phone.replace(/\D/g, '')}` : '+91 98765 43210'
      });
      success('Account created successfully! Welcome to BharatBazaar.');
      navigate('/');
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card register-wide-card">
        <div className="auth-card-header">
          <span className="auth-flag">🇮🇳</span>
          <h2>Create Your BharatBazaar Account</h2>
          <p>Join millions of Indian shoppers enjoying festive offers and doorstep delivery</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group-auth">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-auth">
            <div className="form-group-auth flex-1">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="aarav@example.in"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-auth flex-1">
              <label>10-Digit Mobile (+91)</label>
              <div className="phone-prefix-field">
                <span className="prefix">+91</span>
                <input
                  type="tel"
                  name="phone"
                  maxLength="10"
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group-auth">
            <label>Create Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-auth">
            <div className="form-group-auth flex-1">
              <label>6-Digit PIN Code {pincodeLoading && <small>(Looking up...)</small>}</label>
              <input
                type="text"
                name="pincode"
                maxLength="6"
                placeholder="e.g. 400001"
                value={formData.pincode}
                onChange={handlePincodeChange}
              />
            </div>
            <div className="form-group-auth flex-1">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group-auth flex-1">
              <label>State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="select-auth"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register for BharatBazaar →'}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <p>
            Already have an account? <Link to="/login">Sign In Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
