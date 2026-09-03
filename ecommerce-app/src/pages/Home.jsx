import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import '../styles/Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll(1, 6);
      setFeaturedProducts(response.data.products || []);
    } catch (err) {
      showError('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">New Season Collection</span>
          <h1 className="hero-title">Welcome to E-Store</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          <Link to="/products" className="btn btn-primary btn-lg hero-btn">
            Shop Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🚚</span>
            </div>
            <h3>Fast Shipping</h3>
            <p>Free delivery on orders over $50</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">💳</span>
            </div>
            <h3>Secure Payment</h3>
            <p>Your payment is safe and encrypted</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">↩️</span>
            </div>
            <h3>Easy Returns</h3>
            <p>30-day money-back guarantee</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">💬</span>
            </div>
            <h3>24/7 Support</h3>
            <p>We're here to help anytime</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="view-all-link">
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="products-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line medium"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id || product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">${product.price.toFixed(2)}</div>
                  <Link
                    to={`/products/${product._id || product.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No products available</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Browse our complete collection of products</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
