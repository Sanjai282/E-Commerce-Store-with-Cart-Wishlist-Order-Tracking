// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('shipping');
  const [error, setError] = useState('');

  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const [billingData, setBillingData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <h2>Your Cart is Empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const tax = total * 0.1;
  const shipping = total > 50 ? 0 : 10;
  const grandTotal = total + tax + shipping;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (e) => {
    let { name, value } = e.target;

    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    // Format expiry
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }

    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShipping = () => {
    if (!shippingData.address || !shippingData.city || !shippingData.state || !shippingData.zipCode || !shippingData.phone) {
      setError('Please fill in all shipping fields');
      return false;
    }
    setError('');
    return true;
  };

  const validateBilling = () => {
    if (!billingData.cardName || !billingData.cardNumber || !billingData.expiry || !billingData.cvv) {
      setError('Please fill in all billing fields');
      return false;
    }
    if (billingData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Invalid card number');
      return false;
    }
    setError('');
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateBilling()) return;

    try {
      setLoading(true);
      const orderData = {
        items: cart,
        shippingAddress: shippingData,
        subtotal: total,
        tax,
        shipping,
        total: grandTotal,
      };

      await ordersAPI.createOrder(orderData);
      await clearCart();
      
      // Show success message and redirect
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-content">
          {/* Steps */}
          <div className="checkout-steps">
            <div className={`step ${currentStep === 'shipping' ? 'active' : 'completed'}`}>
              <span className="step-number">1</span>
              <span className="step-name">Shipping</span>
            </div>
            <div className={`step ${currentStep === 'billing' ? 'active' : currentStep === 'payment' ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-name">Billing</span>
            </div>
            <div className={`step ${currentStep === 'payment' ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-name">Review</span>
            </div>
          </div>

          {/* Shipping Step */}
          {currentStep === 'shipping' && (
            <div className="checkout-form">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingData.address}
                  onChange={handleShippingChange}
                  placeholder="123 Main St"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingData.city}
                    onChange={handleShippingChange}
                    placeholder="New York"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingData.state}
                    onChange={handleShippingChange}
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingData.zipCode}
                    onChange={handleShippingChange}
                    placeholder="10001"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleShippingChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (validateShipping()) setCurrentStep('billing');
                }}
                className="btn btn-primary btn-block"
              >
                Continue to Billing
              </button>
            </div>
          )}

          {/* Billing Step */}
          {currentStep === 'billing' && (
            <div className="checkout-form">
              <h2>Payment Method</h2>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={billingData.cardName}
                  onChange={handleBillingChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={billingData.cardNumber}
                  onChange={handleBillingChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={billingData.expiry}
                    onChange={handleBillingChange}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={billingData.cvv}
                    onChange={handleBillingChange}
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>
              <div className="button-group">
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (validateBilling()) setCurrentStep('payment');
                  }}
                  className="btn btn-primary"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'payment' && (
            <div className="checkout-review">
              <h2>Review Your Order</h2>

              <div className="review-section">
                <h3>Shipping Address</h3>
                <p>{shippingData.address}</p>
                <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                <p>{shippingData.phone}</p>
              </div>

              <div className="review-section">
                <h3>Payment Method</h3>
                <p>Card: **** **** **** {billingData.cardNumber.slice(-4)}</p>
              </div>

              <div className="button-group">
                <button
                  onClick={() => setCurrentStep('billing')}
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item._id || item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;