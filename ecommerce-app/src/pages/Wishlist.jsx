import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR, calculateSavings } from '../utils/indianUtils';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = async (product) => {
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
      const pid = product._id || product.id;
      await addToCart(pid, 1);
      await removeFromWishlist(pid);
      success(`Moved ${product.name} to your Cart! 🛒`);
    } catch (err) {
      showError('Failed to move item to cart');
    }
  };

  const handleRemove = async (productId, name) => {
    try {
      await removeFromWishlist(productId);
      success(`Removed ${name} from your wishlist`);
    } catch (err) {
      showError('Failed to remove item');
    }
  };

  if (!user) {
    return (
      <div className="wishlist-page empty-wishlist-view">
        <div className="empty-wishlist-card">
          <div className="wishlist-empty-icon">❤️</div>
          <h2>Please Sign In</h2>
          <p>Sign in to see your saved items and festive wishlist.</p>
          <Link to="/login" className="btn btn-primary">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page loading-wishlist-view">
        <p>Loading your saved items...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page empty-wishlist-view">
        <div className="empty-wishlist-card">
          <div className="wishlist-empty-icon">🤍</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Explore thousands of authentic Indian products and click the heart icon to save them!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Deals Now 🛍️
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>
            <p className="wishlist-sub">
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
          <button onClick={() => navigate('/products')} className="btn btn-outline btn-sm">
            Continue Shopping
          </button>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((product) => {
            const pid = product._id || product.id;
            const { amount: savings, percent } = calculateSavings(product.mrp, product.price);

            return (
              <div key={pid} className="wishlist-card">
                <div className="wishlist-card-media">
                  <img src={product.image} alt={product.name} />
                  <button
                    type="button"
                    className="btn-wishlist-remove-icon"
                    onClick={() => handleRemove(pid, product.name)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                  <span className="origin-pill">Made in India 🇮🇳</span>
                </div>

                <div className="wishlist-card-content">
                  <span className="card-cat">{product.category}</span>
                  <h3 className="card-name" title={product.name}>
                    {product.name}
                  </h3>

                  <div className="card-prices-line">
                    <span className="deal-price">{formatINR(product.price)}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="mrp-price">{formatINR(product.mrp)}</span>
                    )}
                  </div>

                  {savings > 0 && (
                    <div className="card-savings-text">Save {formatINR(savings)} ({percent}% OFF)</div>
                  )}

                  <div className="in-stock-label">✔ In Stock &amp; Ready to Ship</div>
                <div className="item-price">₹{item.price.toFixed(2)}</div>

                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    className="btn btn-primary btn-move-cart"
                  >
                    Move to Cart 🛒
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
