import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { couponsAPI } from '../services/api';
import { formatINR, calculateSavings } from '../utils/indianUtils';
import '../styles/Cart.css';

const AVAILABLE_COUPONS = [
  { code: 'INDIA100', desc: 'Flat ₹100 OFF (Min ₹799)' },
  { code: 'FESTIVE15', desc: '15% OFF up to ₹500 (Min ₹999)' },
  { code: 'FREESHIP', desc: 'Free Delivery on any order' }
];

const Cart = () => {
  const { cart, removeFromCart, updateCartItem, getCartTotal, getCartMRP, clearCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, deliveryPincode, deliveryCity } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const total = getCartTotal();
  const totalMRP = getCartMRP();
  const mrpSavings = Math.max(0, totalMRP - total);

  // Taxes and Shipping
  let couponDiscount = 0;
  let freeShippingFromCoupon = false;

  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round((total * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
        couponDiscount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.flatDiscount) {
      couponDiscount = appliedCoupon.flatDiscount;
    }
    if (appliedCoupon.freeShipping) {
      freeShippingFromCoupon = true;
    }
  }

  // Delivery: Free if total > 499 or coupon provides free shipping
  const shipping = total >= 499 || freeShippingFromCoupon ? 0 : 49;
  const taxableAmount = Math.max(0, total - couponDiscount);
  const tax = Math.round(taxableAmount * 0.18);
  const cgst = Math.round(tax / 2);
  const sgst = Math.round(tax / 2);
  const grandTotal = taxableAmount + tax + shipping;

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
  const handleQuantityChange = async (productId, quantity, productName) => {
    if (quantity <= 0) {
      handleRemove(productId, productName);
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError('');
      const res = await couponsAPI.validate(code, total);
      setAppliedCoupon(res.data.coupon);
      setCouponCode(code);
      success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or inapplicable coupon code';
      setCouponError(msg);
      showError(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    info('Coupon removed');
  };

  const handleMoveToWishlist = async (item) => {
    const pid = item.productId || item.id;
    if (!isInWishlist(pid)) {
      await toggleWishlist(pid);
    }
    await removeFromCart(pid);
    success(`Moved ${item.name} to Wishlist ❤️`);
  };

  const handleProceedCheckout = () => {
    if (!user) {
      showError('Please sign in to proceed with checkout');
      navigate('/login');
      return;
    }
    // Save coupon and pricing state to sessionStorage for checkout
    sessionStorage.setItem(
      'checkout_pricing',
      JSON.stringify({
        subtotal: total,
        totalMRP,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code || null,
        tax,
        cgst,
        sgst,
        shipping,
        grandTotal
      })
    );
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart-view">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your BharatBazaar Cart is Empty</h2>
          <p>Explore thousands of authentic Indian products and festive deals!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping Now 🛍️
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-layout-container">
        {/* Left Col: Cart Items */}
        <div className="cart-items-column">
          <div className="cart-header-box">
            <div>
              <h1>Shopping Cart</h1>
              <p className="cart-subtitle">
                {cart.length} unique item{cart.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire cart?')) {
                  clearCart();
                }
              }}
              className="clear-cart-link"
            >
              Clear Cart
            </button>
          </div>

          {/* Delivery destination bar */}
          <div className="delivery-destination-strip">
            <span className="dest-icon">📍</span>
            <span>
              Deliver to: <strong>{deliveryCity} - {deliveryPincode}</strong>
            </span>
            <span className="dest-speed">⚡ Delivery by Tomorrow</span>
          </div>

          {/* Items List */}
          <div className="cart-items-list">
            {cart.map((item) => {
              const pid = item.productId || item.id;
              const { amount: savings } = calculateSavings(item.mrp, item.price);
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                </div>

              return (
                <div key={pid} className="cart-item-row">
                  <div className="item-thumbnail">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="item-details-body">
                    <div className="item-top-row">
                      <span className="item-cat-label">{item.category}</span>
                      <span className="item-in-stock-badge">In Stock</span>
                    </div>

                    <h3 className="item-product-name">{item.name}</h3>

                    <div className="item-pricing-row">
                      <span className="item-current-price">{formatINR(item.price)}</span>
                      {item.mrp && item.mrp > item.price && (
                        <span className="item-mrp-price">{formatINR(item.mrp)}</span>
                      )}
                      {savings > 0 && (
                        <span className="item-savings-text">Save {formatINR(savings)}</span>
                      )}
                    </div>

                    <p className="hsn-code-text">HSN Code: {item.hsnCode || '85183000'} (GST 18% Applicable)</p>

                    <div className="item-actions-row">
                      {/* Quantity Controller */}
                      <div className="qty-control">
                        <button
                          type="button"
                          onClick={() => updateCartItem(pid, item.quantity - 1)}
                          className="qty-arrow-btn"
                        >
                          -
                        </button>
                        <span className="qty-count">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartItem(pid, item.quantity + 1)}
                          className="qty-arrow-btn"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(item)}
                        className="item-secondary-btn"
                      >
                        ❤️ Move to Wishlist
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(pid)}
                        className="item-secondary-btn delete-btn"
                      >
                        🗑️ Remove
                      </button>

                      <div className="item-subtotal-price">
                        Subtotal: <strong>{formatINR(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  </div>
                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Indian Pricing Breakdown & Coupons */}
        <div className="cart-summary-column">
          {/* Coupon Box */}
          <div className="coupon-card">
            <h3>Apply Indian Festive Coupon</h3>
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="Enter coupon (e.g. INDIA100)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
                className="coupon-input"
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="coupon-remove-btn"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  disabled={couponLoading || !couponCode.trim()}
                  className="coupon-apply-btn"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              )}
            </div>

            {couponError && <p className="coupon-error-msg">{couponError}</p>}

            {appliedCoupon && (
              <div className="coupon-applied-alert">
                <span>✔ Coupon <strong>{appliedCoupon.code}</strong> applied!</span>
                <span className="discount-saved-val">- {formatINR(couponDiscount)}</span>
              </div>
            )}

            {/* Clickable Quick Coupon Chips */}
            {!appliedCoupon && (
              <div className="coupon-chips-list">
                <span className="available-coupons-title">Available Festive Offers:</span>
                {AVAILABLE_COUPONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className="coupon-chip-btn"
                    onClick={() => handleApplyCoupon(c.code)}
                  >
                    <strong>{c.code}</strong>: {c.desc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Breakdown Card */}
          <div className="price-details-card">
            <h3 className="price-details-title">Price Details ({cart.length} Items)</h3>

            <div className="price-row-item">
              <span>Total MRP:</span>
              <span>{formatINR(totalMRP)}</span>
            </div>

            {mrpSavings > 0 && (
              <div className="price-row-item discount-green">
                <span>Discount on MRP:</span>
                <span>- {formatINR(mrpSavings)}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="price-row-item discount-green">
                <span>Coupon Savings ({appliedCoupon.code}):</span>
                <span>- {formatINR(couponDiscount)}</span>
              </div>
            )}

            <div className="price-row-item">
              <span>Item Subtotal:</span>
              <span>{formatINR(taxableAmount)}</span>
            </div>

            {/* Indian GST Breakdown */}
            <div className="price-row-item tax-subrow">
              <span>18% GST (CGST 9% + SGST 9%):</span>
              <span>{formatINR(tax)}</span>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="price-row-item">
              <span>Delivery Charges:</span>
              <span>
                {shipping === 0 ? (
                  <strong className="text-free-green">FREE Delivery</strong>
                ) : (
                  formatINR(shipping)
                  `₹${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            {shipping > 0 && (
              <p className="free-shipping-threshold-hint">
                Add items worth {formatINR(499 - total)} more for <strong>FREE Delivery</strong>!
              </p>
            )}

            <div className="price-details-divider"></div>

            <div className="price-row-item total-amount-row">
              <span>Total Amount Payable:</span>
              <span className="grand-total-amount">{formatINR(grandTotal)}</span>
            </div>

            {(mrpSavings + couponDiscount) > 0 && (
              <div className="total-savings-badge">
                🎉 You will save {formatINR(mrpSavings + couponDiscount)} on this order!
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <div className="free-shipping-notice">
                <span className="notice-icon">💡</span>
                Add ₹{(50 - total).toFixed(2)} more for free shipping!
              </div>
            )}

            <button
              type="button"
              onClick={handleProceedCheckout}
              className="btn btn-checkout-proceed"
              onClick={handleCheckout}
              className="btn btn-primary btn-block btn-lg"
            >
              Proceed to Indian Checkout →
            </button>

            <div className="cart-trust-badges">
              <span>🔒 100% Safe &amp; Secure Payments</span>
              <span>🇮🇳 Verified Indian Sellers</span>
              <span>📦 Easy Doorstep Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
