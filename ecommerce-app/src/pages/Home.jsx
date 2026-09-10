// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll(1, 6);
      setFeaturedProducts(response.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to E-Store</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🚚</span>
            <h3>Fast Shipping</h3>
            <p>Free delivery on orders over $50</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💳</span>
            <h3>Secure Payment</h3>
            <p>Your payment is safe and encrypted</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">↩️</span>
            <h3>Easy Returns</h3>
            <p>30-day money-back guarantee</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💬</span>
            <h3>24/7 Support</h3>
            <p>We're here to help anytime</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2 className="section-title">Featured Products</h2>
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id || product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image || 'https://via.placeholder.com/200'}
                    alt={product.name}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-price">₹{product.price.toFixed(2)}</div>
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
          <p className="empty-state">No products available</p>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Shopping?</h2>
        <p>Browse our complete collection of products</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          View All Products
        </Link>
      </section>
    </div>
  );
};

export default Home;