import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/Products.css';

const ProductSkeleton = () => (
  <div className="product-card skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-line short"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-buttons">
        <div className="skeleton-btn"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
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

  const handleAddToCart = async (productId, productName) => {
    if (!user) {
      showError('Please log in to add items to your cart');
      navigate('/login');
      return;
    }
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
      success(`${productName} added to cart!`);
    } catch (err) {
      showError('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleWishlist = async (productId, productName) => {
    if (!user) {
      showError('Please log in to manage your wishlist');
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(productId);
      const inWishlist = isInWishlist(productId);
      success(inWishlist ? `${productName} removed from wishlist` : `${productName} added to wishlist!`);
    } catch (err) {
      showError('Failed to update wishlist');
    }
  };

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="products-grid">
            {[...Array(6)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
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
                      loading="lazy"
                    />
                    <button
                      className={`wishlist-btn ${isInWishlist(product._id || product.id) ? 'active' : ''}`}
                      onClick={() => handleToggleWishlist(product._id || product.id, product.name)}
                      title={isInWishlist(product._id || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {isInWishlist(product._id || product.id) ? '❤️' : '🤍'}
                    </button>
                    {product.stock <= 10 && product.stock > 0 && (
                      <span className="stock-badge low">Only {product.stock} left!</span>
                    )}
                  </div>

                  <div className="product-card-body">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">
                      {product.description?.substring(0, 60)}...
                    </p>

                    <div className="product-footer">
                      <div className="product-price">
                        ${product.price.toFixed(2)}
                      </div>

                      <div className="product-actions">
                        <Link
                          to={`/products/${product._id || product.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product._id || product.id, product.name)}
                          className="btn btn-primary btn-sm"
                          disabled={addingToCart === (product._id || product.id)}
                        >
                          {addingToCart === (product._id || product.id) ? (
                            <span className="btn-loading"></span>
                          ) : (
                            'Add to Cart'
                          )}
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
                  ← Previous
                </button>

                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setPage(index + 1)}
                      className={`page-number ${page === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No products found</h2>
            <p>Try adjusting your search or browse all products</p>
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
