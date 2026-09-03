import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateCartItem, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error: showError, warning } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (productId, quantity, productName) => {
    if (quantity <= 0) {
      handleRemove(productId, productName);
      return;
    }
    try {
      await updateCartItem(productId, quantity);
      success(`Updated ${productName} quantity`);
    } catch (err) {
      showError('Failed to update quantity');
    }
  };

  const handleRemove = async (productId, productName) => {
    try {
      await removeFromCart(productId);
      success(`${productName} removed from cart`);
    } catch (err) {
      showError('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    warning('Clearing your cart...');
    try {
      await clearCart();
      success('Cart cleared successfully');
    } catch (err) {
      showError('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      showError('Please login first');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const total = getCartTotal();
  const tax = total * 0.1;
  const shipping = total > 50 ? 0 : 10;
  const grandTotal = total + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id || item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.image || 'https://via.placeholder.com/120'}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id || item.id, item.quantity - 1, item.name)
                    }
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item._id || item.id,
                        parseInt(e.target.value) || 1,
                        item.name
                      )
                    }
                    min="1"
                    className="qty-input"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id || item.id, item.quantity + 1, item.name)
                    }
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemove(item._id || item.id, item.name)}
                  className="btn-remove"
                  title="Remove item"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="free-shipping">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <div className="free-shipping-notice">
                <span className="notice-icon">💡</span>
                Add ${(50 - total).toFixed(2)} more for free shipping!
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              Proceed to Checkout
            </button>

            <div className="summary-actions">
              <button
                onClick={handleClearCart}
                className="btn btn-secondary btn-block"
              >
                Clear Cart
              </button>
              <Link to="/products" className="btn btn-tertiary btn-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
