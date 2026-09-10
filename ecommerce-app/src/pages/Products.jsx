// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      let response;

      if (searchTerm) {
        response = await productsAPI.search(searchTerm);
      } else {
        response = await productsAPI.getAll(page, 12);
      }

      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ search: searchTerm });
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please log in to add items to your cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId, 1);
    } catch (err) {
      console.error('Failed to add product to cart:', err);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      alert('Please log in to manage your wishlist');
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(productId);
    } catch (err) {
      console.error('Failed to update wishlist:', err);
    }
  };

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading State */}
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id || product.id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={product.image || 'https://via.placeholder.com/250'}
                      alt={product.name}
                      className="product-image"
                    />
                    <button
                      className={`wishlist-btn ${isInWishlist(product._id || product.id) ? 'active' : ''}`}
                      onClick={() => handleToggleWishlist(product._id || product.id)}
                      title="Add to wishlist"
                    >
                      ❤️
                    </button>
                  </div>

                  <div className="product-card-body">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">
                      {product.description?.substring(0, 60)}...
                    </p>

                    <div className="product-footer">
                      <div className="product-price">
                        ₹{product.price.toFixed(2)}
                      </div>

                      <div className="product-actions">
                        <Link
                          to={`/products/${product._id || product.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product._id || product.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>

                <span className="page-info">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No products found</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;