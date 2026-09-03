import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="wishlist-page empty-state">
        <div className="empty-icon">🔐</div>
        <h2>Please Login</h2>
        <p>You need to be logged in to view your wishlist</p>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleAddToCart = async (productId, productName) => {
    try {
      await addToCart(productId, 1);
      success(`${productName} added to cart!`);
    } catch (err) {
      showError('Failed to add to cart');
    }
  };

  const handleRemove = async (productId, productName) => {
    try {
      await removeFromWishlist(productId);
      success(`${productName} removed from wishlist`);
    } catch (err) {
      showError('Failed to remove from wishlist');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page empty-state">
        <div className="empty-icon">💝</div>
        <h2>Your Wishlist is Empty</h2>
        <p>Save your favorite items here for later</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <span className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item._id || item.id} className="wishlist-card">
              <div className="card-image">
                <img
                  src={item.image || 'https://via.placeholder.com/250'}
                  alt={item.name}
                  loading="lazy"
                />
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item._id || item.id, item.name)}
                  title="Remove from wishlist"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="card-content">
                <span className="item-category">{item.category}</span>
                <h3 className="item-name">{item.name}</h3>

                <p className="item-description">
                  {item.description?.substring(0, 80)}...
                </p>

                <div className="item-price">${item.price.toFixed(2)}</div>

                <div className="item-actions">
                  <button
                    onClick={() => handleAddToCart(item._id || item.id, item.name)}
                    className="btn btn-primary btn-sm"
                  >
                    Add to Cart
                  </button>

                  <Link
                    to={`/products/${item._id || item.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-footer">
          <Link to="/products" className="btn btn-tertiary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
