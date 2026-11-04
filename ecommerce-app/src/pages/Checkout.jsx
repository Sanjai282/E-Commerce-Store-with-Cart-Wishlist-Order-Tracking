import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ordersAPI, pincodeAPI, authAPI } from '../services/api';
import { formatINR, INDIAN_STATES, INDIAN_BANKS, UPI_APPS } from '../utils/indianUtils';
import InvoiceModal from '../components/InvoiceModal';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, getCartMRP, clearCart } = useCart();
  const { user, deliveryPincode, deliveryCity } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping' | 'payment' | 'review' | 'success'
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Placed Order & GST Invoice State
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Live Dynamic UPI Simulator State
  const [upiCountdown, setUpiCountdown] = useState(300); // 5 mins in seconds
  const [simulatingUPI, setSimulatingUPI] = useState(false);

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr-01',
      fullName: user?.name || 'Aarav Sharma',
      phone: '9876543210',
      address: 'Flat 402, Sunshine Towers, Marine Drive',
      landmark: 'Opposite Marine Plaza Hotel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      addressType: 'Home',
      isDefault: true
    },
    {
      id: 'addr-02',
      fullName: (user?.name || 'Aarav Sharma') + ' (Office)',
      phone: '9876543210',
      address: 'Floor 12, Express Towers, Nariman Point',
      landmark: 'Near Air India Building',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400021',
      addressType: 'Work',
      isDefault: false
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr-01');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Shipping Form Data
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || 'Aarav Sharma',
    phone: user?.phone?.replace('+91 ', '') || '9876543210',
    address: 'Flat 402, Sunshine Towers, Marine Drive',
    landmark: 'Opposite Marine Plaza',
    pincode: deliveryPincode || '400001',
    city: deliveryCity || 'Mumbai',
    state: user?.state || 'Maharashtra',
    addressType: 'Home'
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'cod' | 'card' | 'netbanking'
  const [selectedUPIApp, setSelectedUPIApp] = useState('gpay');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(true);

  // COD Anti-Fraud Captcha
  const [captchaCode, setCaptchaCode] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [userCaptcha, setUserCaptcha] = useState('');

  // Card details
  const [cardData, setCardData] = useState({
    cardName: user?.name || 'Aarav Sharma',
    cardNumber: '4532 8901 2345 6789',
    expiry: '11/28',
    cvv: '829'
  });

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('sbi');

  // Load pricing from sessionStorage (set during Cart)
  const cartSubtotal = getCartTotal();
  const cartMRP = getCartMRP();
  const [pricing] = useState(() => {
    try {
      const stored = sessionStorage.getItem('checkout_pricing');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const defaultTax = Math.round(cartSubtotal * 0.18);
    const defaultShipping = cartSubtotal >= 499 ? 0 : 49;
    return {
      subtotal: cartSubtotal,
      totalMRP: cartMRP,
      discount: 0,
      couponCode: null,
      tax: defaultTax,
      cgst: defaultTax / 2,
      sgst: defaultTax / 2,
      shipping: defaultShipping,
      grandTotal: cartSubtotal + defaultTax + defaultShipping
    };
  });

  useEffect(() => {
    if (cart.length === 0 && !placedOrder && currentStep !== 'success') {
      navigate('/cart');
    }
  }, [cart, navigate, placedOrder, currentStep]);

  // UPI 5-minute dynamic countdown timer
  useEffect(() => {
    let timer;
    if (currentStep === 'payment' && paymentMethod === 'upi') {
      timer = setInterval(() => {
        setUpiCountdown((prev) => (prev > 1 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, paymentMethod]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        if (user) {
          const res = await authAPI.getAddresses();
          if (res.data?.addresses && res.data.addresses.length > 0) {
            setSavedAddresses(res.data.addresses);
            const defaultAddr = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
            setSelectedAddressId(defaultAddr.id);
            setShippingData({
              fullName: defaultAddr.fullName,
              phone: (defaultAddr.phone || '9876543210').replace('+91 ', ''),
              address: defaultAddr.address,
              landmark: defaultAddr.landmark || '',
              pincode: defaultAddr.pincode,
              city: defaultAddr.city,
              state: defaultAddr.state,
              addressType: defaultAddr.addressType || 'Home'
            });
          }
        }
      } catch (e) {}
    };
    fetchUserAddresses();
  }, [user]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setIsAddingNewAddress(false);
    setShippingData({
      fullName: addr.fullName,
      phone: (addr.phone || '9876543210').replace('+91 ', ''),
      address: addr.address,
      landmark: addr.landmark || '',
      pincode: addr.pincode,
      city: addr.city,
      state: addr.state,
      addressType: addr.addressType || 'Home'
    });
    setErrorMessage('');
  };

  // Handle Indian PIN code auto-lookup
  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setShippingData((prev) => ({ ...prev, pincode: val }));

    if (val.length === 6) {
      try {
        setPincodeLoading(true);
        const res = await pincodeAPI.lookup(val);
        if (res.data) {
          setShippingData((prev) => ({
            ...prev,
            city: res.data.city || prev.city,
            state: res.data.state || prev.state
          }));
          info(`Auto-detected: ${res.data.city}, ${res.data.state}`);
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    if (!shippingData.fullName.trim()) {
      setErrorMessage('Please enter recipient full name');
      return false;
    }
    const cleanPhone = shippingData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return false;
    }
    if (!shippingData.address.trim()) {
      setErrorMessage('Please enter street / house address');
      return false;
    }
    if (!shippingData.pincode || shippingData.pincode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code');
      return false;
    }
    if (!shippingData.city.trim() || !shippingData.state) {
      setErrorMessage('Please specify city and state');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateShipping()) return;
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToReview = () => {
    if (paymentMethod === 'cod') {
      if (userCaptcha.trim() !== captchaCode) {
        setErrorMessage('Verification code mismatch. Please enter the 4-digit code shown.');
        return;
      }
    }
    setErrorMessage('');
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'upi':
        return `UPI (${UPI_APPS.find((u) => u.id === selectedUPIApp)?.name || 'Google Pay'})`;
      case 'cod':
        return 'Cash on Delivery (COD)';
      case 'card':
        return 'RuPay / Debit / Credit Card';
      case 'netbanking':
        return `Net Banking (${INDIAN_BANKS.find((b) => b.id === selectedBank)?.name || 'SBI'})`;
      default:
        return 'UPI';
    }
  };

  const handleSimulateUPIApproval = async () => {
    const appName = UPI_APPS.find((u) => u.id === selectedUPIApp)?.name || 'Google Pay';
    info(`📲 Push approval request sent to your ${appName} app...`);
    setSimulatingUPI(true);

    setTimeout(async () => {
      try {
        success(`✔ UPI Payment of ${formatINR(pricing.grandTotal)} approved by HDFC Bank!`);
        await handlePlaceOrder(`UPI (${appName} Instant Pay)`);
      } catch (err) {
        showError('UPI transaction simulation failed. Please try again.');
      } finally {
        setSimulatingUPI(false);
      }
    }, 1200);
  };

  const handlePlaceOrder = async (overrideMethod) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const resolvedPaymentMethod = typeof overrideMethod === 'string' ? overrideMethod : getPaymentMethodDisplay();

      const orderPayload = {
        items: cart,
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        couponCode: pricing.couponCode,
        shipping: pricing.shipping,
        tax: pricing.tax,
        total: pricing.grandTotal,
        paymentMethod: resolvedPaymentMethod,
        shippingAddress: {
          fullName: shippingData.fullName,
          phone: `+91 ${shippingData.phone}`,
          address: shippingData.address,
          landmark: shippingData.landmark,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.pincode,
          addressType: shippingData.addressType
        }
      };

      const res = await ordersAPI.createOrder(orderPayload);
      const newOrder = res.data?.order || {
        ...orderPayload,
        orderId: `ORD-IN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        courier: 'Delhivery Surface Express',
        trackingNumber: `DEL-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
        deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
        createdAt: new Date().toISOString()
      };

      if (isAddingNewAddress && saveToProfile) {
        try {
          await authAPI.addAddress({
            fullName: shippingData.fullName,
            phone: shippingData.phone,
            address: shippingData.address,
            landmark: shippingData.landmark,
            city: shippingData.city,
            state: shippingData.state,
            pincode: shippingData.pincode,
            addressType: shippingData.addressType
          });
        } catch (e) {}
      }

      await clearCart();
      sessionStorage.removeItem('checkout_pricing');

      setPlacedOrder(newOrder);
      setCurrentStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      success('🎉 Order Placed! Your GST Tax Invoice is ready.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setErrorMessage(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-layout-wrapper">
        {/* Progress Stepper */}
        <div className="checkout-stepper-header">
          <div className={`checkout-step-pill ${currentStep === 'shipping' ? 'active' : 'completed'}`}>
            <span className="step-num">1</span>
            <span className="step-title">Indian Address</span>
          </div>
          <div className="step-arrow-divider">→</div>
          <div className={`checkout-step-pill ${currentStep === 'payment' ? 'active' : (currentStep === 'review' || currentStep === 'success') ? 'completed' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-title">Payment Mode</span>
          </div>
          <div className="step-arrow-divider">→</div>
          <div className={`checkout-step-pill ${currentStep === 'review' ? 'active' : currentStep === 'success' ? 'completed' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-title">Confirm &amp; Order</span>
          </div>
          {currentStep === 'success' && (
            <>
              <div className="step-arrow-divider">→</div>
              <div className="checkout-step-pill active order-placed-stepper-pill">
                <span className="step-num">✔</span>
                <span className="step-title">Order Placed 🎉</span>
              </div>
            </>
          )}
        </div>

        {errorMessage && <div className="checkout-error-banner">{errorMessage}</div>}

        {currentStep === 'success' && placedOrder ? (
          <div className="order-success-card">
            <div className="success-icon-badge">🎉</div>
            <h2 className="success-title">Order Confirmed!</h2>
            <p className="success-subtitle">
              Thank you for shopping with BharatBazaar! An SMS &amp; WhatsApp update has been sent to{' '}
              <strong>+91 {placedOrder.shippingAddress?.phone?.replace('+91 ', '') || shippingData.phone}</strong>.
            </p>

            <div className="success-meta-grid">
              <div className="success-meta-tile">
                <span className="sm-label">ORDER ID</span>
                <strong className="sm-val text-brand">{placedOrder.orderId || placedOrder._id}</strong>
                <span className="sm-sub">Keep this for support reference</span>
              </div>
              <div className="success-meta-tile">
                <span className="sm-label">SECURE DELIVERY OTP</span>
                <strong className="sm-val text-green">{placedOrder.deliveryOtp || '4829'}</strong>
                <span className="sm-sub">Share at doorstep after inspecting parcel</span>
              </div>
              <div className="success-meta-tile">
                <span className="sm-label">LOGISTICS PARTNER</span>
                <strong className="sm-val">{placedOrder.courier || 'Delhivery Express'}</strong>
                <span className="sm-sub">Tracking: {placedOrder.trackingNumber || 'DEL-92384712IN'}</span>
              </div>
              <div className="success-meta-tile">
                <span className="sm-label">AMOUNT PAID</span>
                <strong className="sm-val">{formatINR(placedOrder.totalAmount || pricing.grandTotal)}</strong>
                <span className="sm-sub">{placedOrder.paymentMethod || 'UPI Instant Pay'}</span>
              </div>
            </div>

            {/* Direct GST Tax Invoice Action Banner */}
            <div className="success-invoice-box">
              <div className="sib-text">
                <span className="sib-icon">🖨️</span>
                <div>
                  <h4>Official GST Tax Invoice Generated</h4>
                  <p>Includes GSTIN: 07AABCB9123F1Z4, PAN, HSN codes, and CGST/SGST tax breakdown for your accounts.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-download-invoice"
                onClick={() => setShowInvoiceModal(true)}
              >
                🖨️ View &amp; Download GST Invoice (PDF)
              </button>
            </div>

            <div className="success-actions-bar">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/orders')}
              >
                🚚 Track in Live Courier Hub
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/products')}
              >
                🛍️ Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="checkout-main-grid">
          {/* Left: Step Form Content */}
          <div className="checkout-form-column">
            {/* STEP 1: Indian Address Form */}
            {currentStep === 'shipping' && (
              <div className="checkout-card-box">
                <div className="box-title-row">
                  <h2>1. Delivery Address</h2>
                  <span className="badge-india">Servicing 28,000+ PIN Codes</span>
                </div>

                {/* Multiple Saved Addresses Selector */}
                {savedAddresses.length > 0 && !isAddingNewAddress ? (
                  <div className="saved-addresses-manager">
                    <div className="saved-addresses-header">
                      <h4>Select From Saved Addresses</h4>
                      <button
                        type="button"
                        className="btn-add-new-address"
                        onClick={() => {
                          setIsAddingNewAddress(true);
                          setShippingData({
                            fullName: user?.name || '',
                            phone: user?.phone?.replace('+91 ', '') || '',
                            address: '',
                            landmark: '',
                            pincode: deliveryPincode || '',
                            city: deliveryCity || '',
                            state: user?.state || 'Maharashtra',
                            addressType: 'Home'
                          });
                        }}
                      >
                        + Add New Delivery Address
                      </button>
                    </div>

                    <div className="saved-address-cards-grid">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            className={`saved-address-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectSavedAddress(addr)}
                          >
                            <div className="card-radio-row">
                              <input
                                type="radio"
                                name="saved_addr_selection"
                                checked={isSelected}
                                onChange={() => handleSelectSavedAddress(addr)}
                              />
                              <span className="addr-tag">{addr.addressType || 'Home'}</span>
                              {addr.isDefault && <span className="default-pill">Default</span>}
                            </div>
                            <strong className="addr-recipient">{addr.fullName}</strong>
                            <p className="addr-text">
                              {addr.address}{addr.landmark ? `, ${addr.landmark}` : ''}
                            </p>
                            <p className="addr-city-pin">
                              {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                            </p>
                            <span className="addr-phone">Phone: +91 {addr.phone}</span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="btn btn-primary btn-step-continue"
                    >
                      Deliver to this Address →
                    </button>
                  </div>
                ) : (
                  <div className="checkout-form-fields">
                    {savedAddresses.length > 0 && (
                      <div className="new-addr-title-row">
                        <h4>Enter New Delivery Address</h4>
                        <button
                          type="button"
                          className="btn-cancel-new-addr"
                          onClick={() => {
                            setIsAddingNewAddress(false);
                            if (savedAddresses.length > 0) {
                              handleSelectSavedAddress(savedAddresses[0]);
                            }
                          }}
                        >
                          ← Choose From Saved Addresses
                        </button>
                      </div>
                    )}

                    <div className="form-field-row">
                      <div className="form-field-group flex-1">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={shippingData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Aarav Sharma"
                          required
                        />
                      </div>
                      <div className="form-field-group flex-1">
                        <label>10-Digit Mobile Number (+91) *</label>
                        <div className="phone-input-wrapper">
                          <span className="phone-prefix">+91</span>
                          <input
                            type="tel"
                            name="phone"
                            maxLength="10"
                            value={shippingData.phone}
                            onChange={handleInputChange}
                            placeholder="98765 43210"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label>Flat, House no., Building, Apartment *</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. Flat 402, Sunshine Heights"
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Area, Street, Sector, Village &amp; Landmark</label>
                      <input
                        type="text"
                        name="landmark"
                        value={shippingData.landmark}
                        onChange={handleInputChange}
                        placeholder="e.g. Near Metro Station / Opposite Central Park"
                      />
                    </div>

                    <div className="form-field-row">
                      <div className="form-field-group flex-1">
                        <label>
                          6-Digit PIN Code * {pincodeLoading && <small>(Looking up...)</small>}
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength="6"
                          value={shippingData.pincode}
                          onChange={handlePincodeChange}
                          placeholder="e.g. 400001"
                          required
                        />
                      </div>
                      <div className="form-field-group flex-1">
                        <label>Town / City *</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Mumbai"
                          required
                        />
                      </div>
                      <div className="form-field-group flex-1">
                        <label>State / Union Territory *</label>
                        <select
                          name="state"
                          value={shippingData.state}
                          onChange={handleInputChange}
                          className="state-select"
                          required
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Address Type */}
                    <div className="form-field-group">
                      <label>Address Type</label>
                      <div className="address-type-chips">
                        <button
                          type="button"
                          className={`type-chip ${shippingData.addressType === 'Home' ? 'active' : ''}`}
                          onClick={() => setShippingData((p) => ({ ...p, addressType: 'Home' }))}
                        >
                          🏠 Home (7 AM - 9 PM delivery)
                        </button>
                        <button
                          type="button"
                          className={`type-chip ${shippingData.addressType === 'Work' ? 'active' : ''}`}
                          onClick={() => setShippingData((p) => ({ ...p, addressType: 'Work' }))}
                        >
                          🏢 Work / Commercial (9 AM - 6 PM delivery)
                        </button>
                      </div>
                    </div>

                    <label className="save-profile-checkbox-row">
                      <input
                        type="checkbox"
                        checked={saveToProfile}
                        onChange={(e) => setSaveToProfile(e.target.checked)}
                      />
                      <span>Save this address to my profile for future orders</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="btn btn-primary btn-step-continue"
                    >
                      Deliver to this Address →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Indian Payment Methods */}
            {currentStep === 'payment' && (
              <div className="checkout-card-box">
                <div className="box-title-row">
                  <h2>2. Select Payment Method</h2>
                  <span className="badge-security">🔒 100% Encrypted &amp; RBI Approved</span>
                </div>

                <div className="payment-tabs-layout">
                  {/* Left Payment Mode Selectors */}
                  <div className="payment-methods-menu">
                    <button
                      type="button"
                      className={`payment-method-nav-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <span className="pm-icon">⚡</span>
                      <div className="pm-text">
                        <strong>UPI Instant Pay</strong>
                        <small>GPay, PhonePe, Paytm, QR</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`payment-method-nav-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <span className="pm-icon">💵</span>
                      <div className="pm-text">
                        <strong>Cash on Delivery (COD)</strong>
                        <small>Pay cash or UPI at delivery</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`payment-method-nav-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <span className="pm-icon">💳</span>
                      <div className="pm-text">
                        <strong>RuPay / Credit / Debit Card</strong>
                        <small>All Indian Banks Supported</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`payment-method-nav-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <span className="pm-icon">🏛️</span>
                      <div className="pm-text">
                        <strong>Net Banking</strong>
                        <small>SBI, HDFC, ICICI, Axis &amp; more</small>
                      </div>
                    </button>
                  </div>

                  {/* Right Payment Configuration Panel */}
                  <div className="payment-details-panel">
                    {/* UPI TAB */}
                    {paymentMethod === 'upi' && (
                      <div className="payment-content-block">
                        <h3>Pay via Unified Payments Interface (UPI)</h3>
                        <p className="pm-subtext">Scan the dynamic QR code or enter your VPA / UPI ID</p>

                        <div className="upi-apps-row">
                          {UPI_APPS.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              className={`upi-app-btn ${selectedUPIApp === app.id ? 'active' : ''}`}
                              onClick={() => setSelectedUPIApp(app.id)}
                            >
                              <span>{app.icon}</span>
                              <small>{app.name}</small>
                            </button>
                          ))}
                        </div>

                        {/* Dynamic Live UPI QR Code Card */}
                        <div className="upi-qr-card dynamic-upi-box">
                          <div className="qr-box">
                            <div className="simulated-qr-svg-wrapper">
                              <svg viewBox="0 0 160 160" width="130" height="130" className="dynamic-upi-qr-svg">
                                <rect width="160" height="160" fill="#ffffff" rx="10" />
                                {/* Finder Pattern Top-Left */}
                                <rect x="14" y="14" width="38" height="38" fill="#0f172a" rx="4" />
                                <rect x="20" y="20" width="26" height="26" fill="#ffffff" rx="2" />
                                <rect x="26" y="26" width="14" height="14" fill="#0f172a" rx="2" />

                                {/* Finder Pattern Top-Right */}
                                <rect x="108" y="14" width="38" height="38" fill="#0f172a" rx="4" />
                                <rect x="114" y="20" width="26" height="26" fill="#ffffff" rx="2" />
                                <rect x="120" y="26" width="14" height="14" fill="#0f172a" rx="2" />

                                {/* Finder Pattern Bottom-Left */}
                                <rect x="14" y="108" width="38" height="38" fill="#0f172a" rx="4" />
                                <rect x="20" y="114" width="26" height="26" fill="#ffffff" rx="2" />
                                <rect x="26" y="120" width="14" height="14" fill="#0f172a" rx="2" />

                                {/* High-Density QR Data Matrix Elements */}
                                <g fill="#0f172a">
                                  <rect x="60" y="18" width="8" height="6" />
                                  <rect x="74" y="18" width="12" height="6" />
                                  <rect x="92" y="24" width="8" height="6" />
                                  <rect x="60" y="32" width="14" height="6" />
                                  <rect x="80" y="30" width="6" height="14" />
                                  <rect x="18" y="60" width="10" height="6" />
                                  <rect x="36" y="60" width="14" height="6" />
                                  <rect x="60" y="56" width="8" height="14" />
                                  <rect x="76" y="60" width="14" height="6" />
                                  <rect x="98" y="56" width="10" height="8" />
                                  <rect x="116" y="60" width="14" height="6" />
                                  <rect x="138" y="56" width="8" height="12" />
                                  <rect x="18" y="74" width="14" height="6" />
                                  <rect x="40" y="74" width="8" height="8" />
                                  <rect x="110" y="74" width="12" height="6" />
                                  <rect x="130" y="74" width="16" height="6" />
                                  <rect x="18" y="90" width="12" height="8" />
                                  <rect x="38" y="90" width="12" height="6" />
                                  <rect x="58" y="86" width="8" height="14" />
                                  <rect x="74" y="92" width="14" height="6" />
                                  <rect x="96" y="86" width="10" height="8" />
                                  <rect x="114" y="92" width="14" height="6" />
                                  <rect x="136" y="86" width="10" height="12" />
                                  <rect x="60" y="112" width="8" height="8" />
                                  <rect x="76" y="112" width="14" height="6" />
                                  <rect x="98" y="108" width="8" height="12" />
                                  <rect x="114" y="114" width="14" height="6" />
                                  <rect x="136" y="112" width="10" height="8" />
                                  <rect x="60" y="128" width="12" height="6" />
                                  <rect x="80" y="128" width="6" height="14" />
                                  <rect x="94" y="128" width="14" height="6" />
                                  <rect x="116" y="128" width="10" height="14" />
                                  <rect x="134" y="132" width="12" height="8" />
                                </g>

                                {/* Center Indian UPI Shield Badge */}
                                <rect x="54" y="66" width="52" height="28" rx="6" fill="#f97316" stroke="#ffffff" strokeWidth="2.5" />
                                <text x="80" y="84" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
                                  UPI 🇮🇳
                                </text>
                              </svg>
                            </div>
                            <span className="qr-vpa-pill">bharatbazaar@hdfcbank</span>
                          </div>

                          <div className="qr-instructions">
                            <div className="qr-inst-header">
                              <h4>Scan &amp; Pay {formatINR(pricing.grandTotal)}</h4>
                              <span className="qr-timer-pill">⏱️ Session: {formatCountdown(upiCountdown)} mins</span>
                            </div>
                            <p>Point phone camera or open Google Pay, PhonePe, Paytm, or BHIM.</p>
                            <div className="upi-instant-perks">
                              <span>✔ Instant 0% Convenience Fee</span>
                              <span>✔ RBI &amp; NPCI 256-Bit Secured</span>
                            </div>

                            {/* One-Click UPI Webhook Simulation Trigger */}
                            <button
                              type="button"
                              className="btn-simulate-upi-approval"
                              onClick={handleSimulateUPIApproval}
                              disabled={simulatingUPI || loading}
                            >
                              {simulatingUPI ? (
                                <span>⏳ Awaiting Bank Webhook Approval...</span>
                              ) : (
                                <span>⚡ Simulate Instant App Approval ({UPI_APPS.find((u) => u.id === selectedUPIApp)?.name || 'GPay'})</span>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="or-divider-line">
                          <span>OR ENTER UPI ID</span>
                        </div>

                        <div className="upi-id-form">
                          <input
                            type="text"
                            placeholder="username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="upi-input"
                          />
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setUpiVerified(true);
                              success('UPI ID verified successfully!');
                            }}
                          >
                            Verify UPI
                          </button>
                        </div>
                        {upiVerified && (
                          <p className="upi-verified-msg">✔ Verified: Aarav Sharma (HDFC Bank)</p>
                        )}
                      </div>
                    )}

                    {/* COD TAB */}
                    {paymentMethod === 'cod' && (
                      <div className="payment-content-block">
                        <h3>Cash on Delivery (COD)</h3>
                        <p className="pm-subtext">
                          You can pay using Cash or scan the delivery executive's UPI QR code at your doorstep.
                        </p>

                        <div className="cod-security-box">
                          <span className="shield-icon">🛡️</span>
                          <div>
                            <h4>Doorstep Verification Guarantee</h4>
                            <p>A 4-digit safe delivery OTP will be sent to your mobile before delivery.</p>
                          </div>
                        </div>

                        {/* Anti-Fraud Captcha */}
                        <div className="cod-captcha-group">
                          <label>Enter verification code to confirm order:</label>
                          <div className="captcha-display-row">
                            <span className="captcha-code-pill">{captchaCode}</span>
                            <input
                              type="text"
                              maxLength="4"
                              placeholder="Enter 4-digit code"
                              value={userCaptcha}
                              onChange={(e) => setUserCaptcha(e.target.value)}
                              className="captcha-input"
                            />
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => {
                                setCaptchaCode(String(Math.floor(1000 + Math.random() * 9000)));
                                setUserCaptcha('');
                              }}
                            >
                              ↻ Refresh
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CARD TAB */}
                    {paymentMethod === 'card' && (
                      <div className="payment-content-block">
                        <div className="card-brand-header">
                          <h3>Debit / Credit Card</h3>
                          <div className="card-network-badges">
                            <span className="rupay-badge">RuPay 🇮🇳</span>
                            <span>VISA</span>
                            <span>Mastercard</span>
                          </div>
                        </div>

                        <div className="card-form-inputs">
                          <div className="form-field-group">
                            <label>Name on Card</label>
                            <input
                              type="text"
                              value={cardData.cardName}
                              onChange={(e) => setCardData((p) => ({ ...p, cardName: e.target.value }))}
                            />
                          </div>

                          <div className="form-field-group">
                            <label>Card Number (16 Digits)</label>
                            <input
                              type="text"
                              maxLength="19"
                              value={cardData.cardNumber}
                              onChange={(e) => {
                                const v = e.target.value
                                  .replace(/\D/g, '')
                                  .replace(/(.{4})/g, '$1 ')
                                  .trim();
                                setCardData((p) => ({ ...p, cardNumber: v }));
                              }}
                            />
                          </div>

                          <div className="form-field-row">
                            <div className="form-field-group flex-1">
                              <label>Valid Thru (MM/YY)</label>
                              <input
                                type="text"
                                maxLength="5"
                                value={cardData.expiry}
                                onChange={(e) => setCardData((p) => ({ ...p, expiry: e.target.value }))}
                              />
                            </div>
                            <div className="form-field-group flex-1">
                              <label>CVV (3 Digits)</label>
                              <input
                                type="password"
                                maxLength="3"
                                value={cardData.cvv}
                                onChange={(e) => setCardData((p) => ({ ...p, cvv: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NET BANKING TAB */}
                    {paymentMethod === 'netbanking' && (
                      <div className="payment-content-block">
                        <h3>Select Indian Bank</h3>
                        <div className="banks-grid-selection">
                          {INDIAN_BANKS.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              className={`bank-select-tile ${selectedBank === b.id ? 'active' : ''}`}
                              onClick={() => setSelectedBank(b.id)}
                            >
                              <span className="bank-logo-ico">{b.logo}</span>
                              <span className="bank-name-lbl">{b.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="step-actions-footer">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="btn btn-secondary"
                  >
                    ← Edit Address
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToReview}
                    className="btn btn-primary"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review and Place Order */}
            {currentStep === 'review' && (
              <div className="checkout-card-box">
                <div className="box-title-row">
                  <h2>3. Review &amp; Confirm Order</h2>
                  <span className="badge-india">GST Invoice Ready</span>
                </div>

                {/* Summary Panels */}
                <div className="review-summary-grid">
                  <div className="review-box">
                    <div className="review-box-header">
                      <h4>📍 Delivering To:</h4>
                      <button onClick={() => setCurrentStep('shipping')} className="btn-edit-link">
                        Change
                      </button>
                    </div>
                    <p className="customer-bold">{shippingData.fullName}</p>
                    <p>{shippingData.address}</p>
                    {shippingData.landmark && <p>Near: {shippingData.landmark}</p>}
                    <p>
                      {shippingData.city}, {shippingData.state} - <strong>{shippingData.pincode}</strong>
                    </p>
                    <p className="phone-bold">Mobile: +91 {shippingData.phone}</p>
                    <span className="address-type-tag">{shippingData.addressType} Delivery</span>
                  </div>

                  <div className="review-box">
                    <div className="review-box-header">
                      <h4>💳 Payment Method:</h4>
                      <button onClick={() => setCurrentStep('payment')} className="btn-edit-link">
                        Change
                      </button>
                    </div>
                    <p className="payment-mode-title">{getPaymentMethodDisplay()}</p>
                    <p className="payment-mode-sub">
                      {paymentMethod === 'cod'
                        ? 'Pay cash or scan UPI QR upon delivery'
                        : 'Secure transaction via RBI approved payment gateway'}
                    </p>
                    <span className="status-confirmed-pill">Payment Verified</span>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <h4 className="ordered-items-heading">Order Items ({cart.length})</h4>
                <div className="review-items-list">
                  {cart.map((item) => (
                    <div key={item.productId || item.id} className="review-item-row">
                      <img src={item.image} alt={item.name} className="review-item-img" />
                      <div className="review-item-info">
                        <h5>{item.name}</h5>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="review-item-price">
                        {formatINR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confirm and Pay Button */}
                <div className="final-checkout-actions">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn btn-primary btn-place-order"
                  >
                    {loading ? 'Processing Order...' : `Confirm & Place Order (${formatINR(pricing.grandTotal)})`}
                  </button>
                  <p className="order-agreement-text">
                    By placing your order, you agree to BharatBazaar’s Indian Retail Conditions of Use and Sale.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Sidebar */}
          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>

              <div className="summary-item-line">
                <span>Items Subtotal:</span>
                <span>{formatINR(pricing.subtotal)}</span>
              </div>

              {pricing.discount > 0 && (
                <div className="summary-item-line text-green">
                  <span>Festive Coupon ({pricing.couponCode}):</span>
                  <span>- {formatINR(pricing.discount)}</span>
                </div>
              )}

              <div className="summary-item-line">
                <span>18% GST (CGST 9% + SGST 9%):</span>
                <span>{formatINR(pricing.tax)}</span>
              </div>

              <div className="summary-item-line">
                <span>Delivery:</span>
                <span>
                  {pricing.shipping === 0 ? <strong className="text-green">FREE</strong> : formatINR(pricing.shipping)}
                </span>
              </div>

              <div className="summary-divider-line"></div>

              <div className="summary-item-line grand-total-line">
                <span>Order Total:</span>
                <span className="grand-price">{formatINR(pricing.grandTotal)}</span>
              </div>

              <div className="gst-tax-info-banner">
                <span>📋 Official GST Tax Invoice will be generated upon confirmation</span>
              </div>

              <div className="checkout-assurance-list">
                <div>✔ 7-Day Easy Doorstep Replacement</div>
                <div>✔ Safe Delivery OTP Protection</div>
                <div>✔ Free Delivery Across India</div>
              </div>
            </div>
          </aside>
        </div>
        )}

        {/* GST Tax Invoice Printable Modal */}
        {showInvoiceModal && placedOrder && (
          <InvoiceModal order={placedOrder} onClose={() => setShowInvoiceModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Checkout;
