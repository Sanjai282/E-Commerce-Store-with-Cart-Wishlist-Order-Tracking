// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateCartItem, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity <= 0) {
      handleRemove(productId);
      return;
    }
    try {
      await updateCartItem(productId, quantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const total = getCartTotal();
  const tax = total * 0.1; // 10% tax
  const shipping = total > 50 ? 0 : 10;
  const grandTotal = total + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-state">
          <h2>Your Cart is Empty</h2>
          <p>Start shopping to add items to your cart</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id || item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.image || 'https://via.placeholder.com/120'}
                    alt={item.name}
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id || item.id, item.quantity - 1)
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
                        parseInt(e.target.value) || 1
                      )
                    }
                    min="1"
                    className="qty-input"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id || item.id, item.quantity + 1)
                    }
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemove(item._id || item.id)}
                  className="btn-remove"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

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
              <span>
                {shipping === 0 ? (
                  <span className="free-shipping">FREE</span>
                ) : (
                  `₹${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <p className="free-shipping-note">
                Free shipping on orders over $50
              </p>
            )}

            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              Proceed to Checkout
            </button>

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
  );
};

export default Cart;