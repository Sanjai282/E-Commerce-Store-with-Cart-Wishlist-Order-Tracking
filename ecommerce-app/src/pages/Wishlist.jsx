// src/pages/Wishlist.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="wishlist-page empty-state">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your wishlist</p>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page empty-state">
        <h2>Your Wishlist is Empty</h2>
        <p>Start adding items to your wishlist</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1>My Wishlist ({wishlist.length})</h1>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item._id || item.id} className="wishlist-card">
              <div className="card-image">
                <img
                  src={item.image || 'https://via.placeholder.com/250'}
                  alt={item.name}
                />
              </div>

              <div className="card-content">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-category">{item.category}</p>

                <p className="item-description">
                  {item.description?.substring(0, 80)}...
                </p>

                <div className="item-price">₹{item.price.toFixed(2)}</div>

                <div className="item-actions">
                  <button
                    onClick={() => handleAddToCart(item._id || item.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Add to Cart
                  </button>

                  <Link
                    to={`/products/${item._id || item.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleRemove(item._id || item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
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