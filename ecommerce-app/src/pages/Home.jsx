import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCompare } from '../context/CompareContext';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { formatINR, calculateSavings, getDeliverySpeed } from '../utils/indianUtils';
import ProductModal from '../components/ProductModal';
import '../styles/Home.css';

const CATEGORIES_DATA = [
  {
    name: 'Electronics',
    title: 'Electronics & Audio',
    subtitle: 'boAt, Noise, OnePlus',
    discount: 'Up to 75% OFF',
    icon: '🎧',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
  },
  {
    name: 'Ethnic Fashion',
    title: 'Indian Ethnic Wear',
    subtitle: 'Banarasi Sarees & Kurtas',
    discount: 'Up to 65% OFF',
    icon: '🥻',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80'
  },
  {
    name: 'Home & Kitchen',
    title: 'Home & Kitchen',
    subtitle: 'Prestige, Milton, Hawkins',
    discount: 'Up to 40% OFF',
    icon: '🍳',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&q=80'
  },
  {
    name: 'Ayurveda & Beauty',
    title: 'Ayurvedic Beauty',
    subtitle: 'Kama & Forest Essentials',
    discount: 'Up to 30% OFF',
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1608248597359-52e85a069502?w=500&q=80'
  },
  {
    name: 'Daily Groceries',
    title: 'Indian Pantry & Snacks',
    subtitle: 'Tata Tea & Haldiram’s',
    discount: 'Up to 25% OFF',
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80'
  }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { addToCompare, isComparing } = useCompare();
  const navigate = useNavigate();

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getAll(1, 8, { sort: 'rating' });
      setFeaturedProducts(res.data.products || []);
    } catch (err) {
      showError('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchFeatured();
    setRecentlyViewed(getRecentlyViewed());
  }, [fetchFeatured, selectedProduct]);

  const handleAddToCart = async (productId, qty = 1, name = 'Item') => {
    try {
      setAddingId(productId);
      await addToCart(productId, qty);
      success(`${name} added to your cart!`);
    } catch (err) {
      showError('Failed to add item to cart');
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = async (productId, name = 'Item') => {
    try {
      setAddingId(productId);
      await addToCart(productId, 1);
      navigate('/checkout');
    } catch (err) {
      showError('Failed to proceed with Buy Now');
    } finally {
      setAddingId(null);
    }
  };

  const handleToggleCompare = (product) => {
    const res = addToCompare(product);
    if (res.success) {
      success(res.message);
    } else {
      showError(res.message);
    }
  };

  const handleToggleWishlist = async (productId, name) => {
    if (!user) {
      showError('Please sign in to manage your wishlist');
      navigate('/login');
      return;
    }
    try {
      const inList = isInWishlist(productId);
      await toggleWishlist(productId);
      success(inList ? `${name} removed from wishlist` : `${name} added to wishlist! ❤️`);
    } catch (err) {
      showError('Failed to update wishlist');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-banner-section">
        <div className="hero-container">
          <div className="hero-badge-pill">
            <span className="pill-dot"></span>
            <span>Great Indian Festive Sale 2026 • Live Now</span>
          </div>

          <h1 className="hero-main-heading">
            Quality Products, <br />
            <span className="heading-gradient">Delivered Across India.</span>
          </h1>

          <p className="hero-subtext">
            Shop 20,000+ authentic Indian electronics, handwoven Banarasi sarees, heavy-duty Prestige cookware, and Ayurvedic wellness essentials at unbelievable festival discounts.
          </p>

          <div className="hero-offer-strip">
            <span className="offer-tag">FESTIVE OFFER:</span>
            <span>Use coupon code <strong>INDIA100</strong> for flat ₹100 OFF on orders ₹799+</span>
          </div>

          <div className="hero-cta-group">
            <Link to="/products" className="btn btn-hero-primary">
              Explore All Deals 🛒
            </Link>
            <Link to="/products?category=Ethnic%20Fashion" className="btn btn-hero-secondary">
              Festive Ethnic Wear 🥻
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Indian Guarantees Bar */}
      <section className="trust-guarantees-bar">
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">⚡</div>
            <div className="trust-text">
              <h4>Express 24-48H Delivery</h4>
              <p>Across 28,000+ Indian Pincodes</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">🛡️</div>
            <div className="trust-text">
              <h4>100% Genuine &amp; BIS Certified</h4>
              <p>Direct from verified Indian brands</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">💵</div>
            <div className="trust-text">
              <h4>Pay via UPI &amp; Cash on Delivery</h4>
              <p>Safe door-step payment with OTP</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">📄</div>
            <div className="trust-text">
              <h4>18% GST Compliant Invoice</h4>
              <p>Full input tax credit eligibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="categories-showcase-section">
        <div className="section-head-row">
          <div>
            <span className="section-badge">TOP VERTICALS</span>
            <h2 className="section-heading">Shop by Category</h2>
          </div>
          <Link to="/products" className="view-all-text-link">
            Explore All Categories →
          </Link>
        </div>

        <div className="category-tiles-grid">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="category-tile-card"
            >
              <div className="cat-tile-image-wrapper">
                <img src={cat.image} alt={cat.title} className="cat-tile-img" loading="lazy" />
                <span className="cat-discount-badge">{cat.discount}</span>
              </div>
              <div className="cat-tile-details">
                <span className="cat-emoji">{cat.icon}</span>
                <h3 className="cat-tile-title">{cat.title}</h3>
                <p className="cat-tile-sub">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Festive Deals Section */}
      <section className="featured-deals-section">
        <div className="section-head-row">
          <div>
            <span className="section-badge festive-badge">🔥 FESTIVE BLOCKBUSTERS</span>
            <h2 className="section-heading">Top Deals of the Day</h2>
          </div>
          <Link to="/products" className="view-all-text-link">
            See All Offers ({featuredProducts.length}+) →
          </Link>
        </div>

        {loading ? (
          <div className="products-loading-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="product-skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="products-showcase-grid">
            {featuredProducts.map((product) => {
              const prodId = product._id || product.id;
              const inWishlist = isInWishlist(prodId);
              const comparing = isComparing(prodId);
              const { amount: savingsAmount, percent: savingsPercent } = calculateSavings(
                product.mrp,
                product.price
              );

              return (
                <div key={prodId} className="home-product-card">
                  {/* Image container */}
                  <div className="card-media-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-product-image"
                      loading="lazy"
                    />

                    {product.badge && <span className="card-deal-badge">{product.badge}</span>}
                    <span className="card-origin-tag">Made in India 🇮🇳</span>

                    {/* Wishlist toggle button */}
                    <button
                      type="button"
                      className={`card-wishlist-btn ${inWishlist ? 'active' : ''}`}
                      onClick={() => handleToggleWishlist(prodId, product.name)}
                      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {inWishlist ? '❤️' : '🤍'}
                    </button>

                    {/* Quick view button overlay */}
                    <button
                      type="button"
                      className="card-quick-view-btn"
                      onClick={() => setSelectedProduct(product)}
                    >
                      👁️ Quick View
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="card-info-body">
                    <span className="card-category-label">{product.category}</span>
                    <h3
                      className="card-product-title"
                      title={product.name}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Rating row */}
                    <div className="card-rating-line">
                      <span className="card-rating-star">★ {product.rating || '4.5'}</span>
                      <span className="card-reviews-num">
                        ({(product.reviewsCount || 850).toLocaleString('en-IN')})
                      </span>
                    </div>

                    {/* Price details */}
                    <div className="card-pricing-block">
                      <div className="price-primary-row">
                        <span className="price-current">{formatINR(product.price)}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="price-mrp">{formatINR(product.mrp)}</span>
                        )}
                      </div>
                      {savingsAmount > 0 && (
                        <div className="card-savings-pill">Save {formatINR(savingsAmount)} ({savingsPercent}% OFF)</div>
                      )}
                    </div>

                    {/* Delivery notice */}
                    <p className="card-free-delivery-text">{getDeliverySpeed(product)}</p>

                    {/* Add to Cart & 1-Click Buy Now */}
                    <div className="home-card-cta-group">
                      <button
                        type="button"
                        className="btn btn-home-cart"
                        onClick={() => handleAddToCart(prodId, 1, product.name)}
                        disabled={addingId === prodId}
                      >
                        {addingId === prodId ? '...' : 'Add 🛒'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-home-buy"
                        onClick={() => handleBuyNow(prodId, product.name)}
                        disabled={addingId === prodId}
                      >
                        ⚡ Buy Now
                      </button>
                    </div>

                    <button
                      type="button"
                      className={`btn-home-compare ${comparing ? 'active' : ''}`}
                      onClick={() => handleToggleCompare(product)}
                    >
                      {comparing ? '✔ In Compare' : '⚖️ Compare'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recently Viewed Products Section */}
      {recentlyViewed.length > 0 && (
        <section className="home-recently-viewed-section">
          <div className="section-head-row">
            <div>
              <span className="section-badge">YOUR HISTORY</span>
              <h2 className="section-heading">🕒 Recently Viewed Products</h2>
            </div>
            <span className="recently-viewed-count">{recentlyViewed.length} items viewed</span>
          </div>

          <div className="home-recent-carousel">
            {recentlyViewed.map((prod) => (
              <div
                key={prod._id || prod.id}
                className="recent-carousel-card"
                onClick={() => setSelectedProduct(prod)}
              >
                <img src={prod.image} alt={prod.name} className="recent-carousel-img" />
                <span className="recent-carousel-cat">{prod.category}</span>
                <h4 className="recent-carousel-title">{prod.name}</h4>
                <div className="recent-carousel-price">
                  <span className="deal-price">{formatINR(prod.price)}</span>
                  {prod.mrp && prod.mrp > prod.price && (
                    <span className="mrp-price">{formatINR(prod.mrp)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Made in India Banner */}
      <section className="vocal-for-local-banner">
        <div className="vocal-content">
          <span className="vocal-badge">🇮🇳 PROUDLY MADE IN BHARAT</span>
          <h2>Empowering 50,000+ Indian Artisans &amp; Local Manufacturers</h2>
          <p>
            From the historic silk handlooms of Varanasi to the tea estates of Assam and the audio engineers of Bengaluru — every rupee you spend directly supports Indian families and local industry.
          </p>
          <div className="vocal-features">
            <div className="vocal-feature-item">
              <span className="vocal-feature-num">28K+</span>
              <span>PIN Codes Served</span>
            </div>
            <div className="vocal-feature-item">
              <span className="vocal-feature-num">100%</span>
              <span>GST Invoiced</span>
            </div>
            <div className="vocal-feature-item">
              <span className="vocal-feature-num">4.8★</span>
              <span>Indian Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isInWishlist={isInWishlist(selectedProduct._id || selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}
    </div>
  );
};

export default Home;
