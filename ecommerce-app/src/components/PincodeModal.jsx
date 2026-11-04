import React, { useState } from 'react';
import { SAMPLE_PINCODES } from '../utils/indianUtils';
import { pincodeAPI } from '../services/api';

const PincodeModal = ({ currentPincode, currentCity, onSave, onClose }) => {
  const [code, setCode] = useState(currentPincode || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setError('Please enter a 6-digit Indian PIN code');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await pincodeAPI.lookup(code.trim());
      onSave(code.trim(), res.data.city || 'India');
      onClose();
    } catch (err) {
      setError('Could not verify PIN code. Saved for general delivery.');
      onSave(code.trim(), 'India');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPopular = (pincode, city) => {
    onSave(pincode, city);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pincode-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pincode-modal-header">
          <h3>Choose Delivery Location</h3>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="pincode-modal-subtitle">
          Select your delivery destination to see product availability and fastest shipping speeds across 28,000+ Indian PIN codes.
        </p>

        <form onSubmit={handleSubmit} className="pincode-modal-form">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit PIN code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="pincode-modal-input"
            autoFocus
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <div className="popular-cities-section">
          <p className="popular-title">Or pick a popular metro:</p>
          <div className="popular-chips">
            {SAMPLE_PINCODES.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`city-chip ${currentPincode === item.code ? 'active' : ''}`}
                onClick={() => handleSelectPopular(item.code, item.city)}
              >
                <span>{item.city}</span>
                <small>({item.code})</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PincodeModal;
