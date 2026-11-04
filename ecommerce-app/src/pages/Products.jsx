import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCompare } from '../context/CompareContext';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { formatINR, calculateSavings, getDeliverySpeed } from '../utils/indianUtils';
import ProductModal from '../components/ProductModal';
import '../styles/Products.css';

const CATEGORIES = [
  { name: 'All', icon: '🛍️', label: 'All Products', count: '500' },
  { name: 'Electronics', icon: '🎧', label: 'Electronics & Audio', count: '100' },
  { name: 'Ethnic Fashion', icon: '🥻', label: 'Ethnic Fashion', count: '100' },
  { name: 'Home & Kitchen', icon: '🍳', label: 'Home & Kitchen', count: '100' },
  { name: 'Ayurveda & Beauty', icon: '🌿', label: 'Ayurveda & Beauty', count: '100' },
  { name: 'Daily Groceries', icon: '☕', label: 'Daily Groceries', count: '100' }
];

const SUBCATEGORIES_MAP = {
  'Electronics': [
    { label: 'All Electronics', value: 'All', icon: '⚡' },
    { label: 'Laptops', value: 'Laptops', icon: '💻' },
    { label: 'Mobile Phones', value: 'Mobile Phones', icon: '📱' },
    { label: 'Tablets', value: 'Tablets', icon: '📟' },
    { label: 'TWS Earbuds', value: 'TWS Earbuds', icon: '🎵' },
    { label: 'Over-Ear Headphones', value: 'Over-Ear Headphones', icon: '🎧' },
    { label: 'Smartwatches', value: 'Smartwatches', icon: '⌚' },
    { label: 'Bluetooth Speakers', value: 'Bluetooth Speakers', icon: '🔊' },
    { label: 'Keyboards & Mice', value: 'Keyboards & Mice', icon: '⌨️' },
    { label: 'Power Banks & Chargers', value: 'Power Banks & Chargers', icon: '🔋' },
    { label: 'Extension Boards & Plugs', value: 'Extension Boards & Plugs', icon: '🔌' }
  ],
  'Ethnic Fashion': [
    { label: 'All Ethnic Fashion', value: 'All', icon: '✨' },
    { label: 'Banarasi Sarees', value: 'Banarasi Sarees', icon: '🥻' },
    { label: 'Kanchipuram Silk Sarees', value: 'Kanchipuram Silk Sarees', icon: '🌸' },
    { label: 'Kurtas & Kurtis', value: 'Kurtas & Kurtis', icon: '👗' },
    { label: 'Anarkali Sets', value: 'Anarkali Sets', icon: '💃' },
    { label: "Men's Sherwanis", value: "Men's Sherwanis", icon: '🤵' },
    { label: "Men's Kurtas & Pyjamas", value: "Men's Kurtas & Pyjamas", icon: '👔' },
    { label: 'Bridal Lehengas', value: 'Bridal Lehengas', icon: '👑' }
  ],
  'Home & Kitchen': [
    { label: 'All Home & Kitchen', value: 'All', icon: '🏠' },
    { label: 'Mixer Grinders', value: 'Mixer Grinders', icon: '🌪️' },
    { label: 'Pressure Cookers', value: 'Pressure Cookers', icon: '🍲' },
    { label: 'Cookware Sets', value: 'Cookware Sets', icon: '🍳' },
    { label: 'Cast Iron Tawas', value: 'Cast Iron Tawas', icon: '🥞' },
    { label: 'Thermos & Flasks', value: 'Thermos & Flasks', icon: '🍶' },
    { label: 'Dinner Sets', value: 'Dinner Sets', icon: '🍽️' },
    { label: 'Spice Boxes', value: 'Spice Boxes', icon: '🧂' },
    { label: 'Electric Kettles', value: 'Electric Kettles', icon: '🫖' }
  ],
  'Ayurveda & Beauty': [
    { label: 'All Ayurveda & Beauty', value: 'All', icon: '🌱' },
    { label: 'Radiance Creams', value: 'Radiance Creams', icon: '✨' },
    { label: 'Facial Serums', value: 'Facial Serums', icon: '💧' },
    { label: 'Rosewater & Toners', value: 'Rosewater & Toners', icon: '🌹' },
    { label: 'Ayurvedic Hair Oils', value: 'Ayurvedic Hair Oils', icon: '🧴' },
    { label: 'Herbal Soaps', value: 'Herbal Soaps', icon: '🧼' },
    { label: 'Chyawanprash & Immunity', value: 'Chyawanprash & Immunity', icon: '🌿' }
  ],
  'Daily Groceries': [
    { label: 'All Daily Groceries', value: 'All', icon: '🛒' },
    { label: 'Basmati Rice & Grains', value: 'Basmati Rice & Grains', icon: '🍚' },
    { label: 'Wheat Atta & Flours', value: 'Wheat Atta & Flours', icon: '🌾' },
    { label: 'Pure Cow Desi Ghee', value: 'Pure Cow Desi Ghee', icon: '🧈' },
    { label: 'Cooking Oils', value: 'Cooking Oils', icon: '🌻' },
    { label: 'Tea & Chai Spices', value: 'Tea & Chai Spices', icon: '☕' },
    { label: 'Dals & Pulses', value: 'Dals & Pulses', icon: '🥣' },
    { label: 'Spices & Turmeric', value: 'Spices & Turmeric', icon: '🌶️' },
    { label: 'Dry Fruits & Nuts', value: 'Dry Fruits & Nuts', icon: '🥜' }
  ]
};

const POPULAR_SUBCATEGORIES_ALL = [
  { label: 'All Catalog', value: 'All', icon: '🛍️' },
  { label: 'Laptops', value: 'Laptops', category: 'Electronics', icon: '💻' },
  { label: 'Mobile Phones', value: 'Mobile Phones', category: 'Electronics', icon: '📱' },
  { label: 'TWS Earbuds', value: 'TWS Earbuds', category: 'Electronics', icon: '🎵' },
  { label: 'Headphones', value: 'Over-Ear Headphones', category: 'Electronics', icon: '🎧' },
  { label: 'Smartwatches', value: 'Smartwatches', category: 'Electronics', icon: '⌚' },
  { label: 'Power Banks', value: 'Power Banks & Chargers', category: 'Electronics', icon: '🔋' },
  { label: 'Silk Sarees', value: 'Banarasi Sarees', category: 'Ethnic Fashion', icon: '🥻' },
  { label: 'Mixer Grinders', value: 'Mixer Grinders', category: 'Home & Kitchen', icon: '🌪️' },
  { label: 'Ayurvedic Oils', value: 'Ayurvedic Hair Oils', category: 'Ayurveda & Beauty', icon: '🌿' },
  { label: 'Desi Ghee', value: 'Pure Cow Desi Ghee', category: 'Daily Groceries', icon: '🧈' }
];

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹1,000', min: '0', max: '999' },
  { label: '₹1,000 - ₹2,500', min: '1000', max: '2500' },
  { label: '₹2,500 - ₹5,000', min: '2500', max: '5000' },
  { label: 'Over ₹5,000', min: '5000', max: '' }
];

const RATING_FILTERS = [
  { label: 'All Ratings', value: '' },
  { label: '4.0★ & Above', value: '4.0', stars: '★★★★☆' },
  { label: '4.3★ Top Rated', value: '4.3', stars: '★★★★★' }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const categoryParam = searchParams.get('category') || 'All';
  const subcategoryParam = searchParams.get('subcategory') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';
  const fastDeliveryParam = searchParams.get('fastDelivery') === 'true';

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { addToCompare, isComparing } = useCompare();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryParam && categoryParam !== 'All') params.category = categoryParam;
      if (subcategoryParam && subcategoryParam !== 'All') params.subcategory = subcategoryParam;
      if (searchParam) params.search = searchParam;
      if (sortParam) params.sort = sortParam;
      if (minPriceParam) params.minPrice = minPriceParam;
      if (maxPriceParam) params.maxPrice = maxPriceParam;
      if (ratingParam) params.rating = ratingParam;
      if (fastDeliveryParam) params.fastDelivery = 'true';

      const res = await productsAPI.getAll(page, 12, params);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalProducts(res.data.totalProducts || (res.data.products || []).length);
    } catch (err) {
      showError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, categoryParam, subcategoryParam, searchParam, sortParam, minPriceParam, maxPriceParam, ratingParam, fastDeliveryParam, showError]);

  useEffect(() => {
    fetchProducts();
    setRecentlyViewed(getRecentlyViewed());
  }, [fetchProducts, selectedProduct]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key === 'category') {
      next.delete('subcategory');
    }
    if (key !== 'page') {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handlePriceRange = (range) => {
    const next = new URLSearchParams(searchParams);
    if (range.min) next.set('minPrice', range.min);
    else next.delete('minPrice');

    if (range.max) next.set('maxPrice', range.max);
    else next.delete('maxPrice');

    next.set('page', '1');
    setSearchParams(next);
  };

  const handleApplyCustomPrice = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (customMin) next.set('minPrice', customMin);
    else next.delete('minPrice');

    if (customMax) next.set('maxPrice', customMax);
    else next.delete('maxPrice');

    next.set('page', '1');
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setCustomMin('');
    setCustomMax('');
    setSearchParams(new URLSearchParams({ page: '1' }));
  };

  const activeFiltersCount = [
    categoryParam !== 'All',
    subcategoryParam !== 'All',
    minPriceParam || maxPriceParam,
    ratingParam,
    fastDeliveryParam,
    searchParam
  ].filter(Boolean).length;

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
    <div className="products-page">
      {/* Top Banner & Breadcrumb */}
      <div className="products-top-banner">
        <div className="products-banner-content">
          <div className="banner-breadcrumb">
            <Link to="/">Home</Link> <span>›</span> <Link to="/products">Products</Link>
            {categoryParam !== 'All' && (
              <>
                <span>›</span>{' '}
                <span
                  className={subcategoryParam === 'All' ? 'crumb-active' : ''}
                  onClick={() => updateParam('subcategory', 'All')}
                  style={{ cursor: subcategoryParam !== 'All' ? 'pointer' : 'default' }}
                >
                  {categoryParam}
                </span>
              </>
            )}
            {subcategoryParam !== 'All' && (
              <>
                <span>›</span> <span className="crumb-active">{subcategoryParam}</span>
              </>
            )}
          </div>
          <div className="banner-badge">
            <span className="badge-flag">🇮🇳</span> 100% GENUINE INDIAN CATALOG
          </div>
          <h1 className="banner-heading">
            {subcategoryParam !== 'All'
              ? subcategoryParam
              : categoryParam === 'All'
              ? 'Shop Top Indian Brands & Artisans'
              : categoryParam}
          </h1>
          <p className="banner-subtext">
            Explore <strong>{totalProducts}</strong> verified items{subcategoryParam !== 'All' ? ` in ${subcategoryParam}` : categoryParam !== 'All' ? ` in ${categoryParam}` : ''} with official GST tax invoice, Safe OTP delivery, and cash on delivery.
          </p>
        </div>
      </div>

      <div className="products-layout-container">
        {/* Mobile Filter Toggle Button */}
        <div className="mobile-filter-bar">
          <button
            type="button"
            className="mobile-filter-toggle-btn"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <span>⚡ Filters &amp; Categories</span>
            {activeFiltersCount > 0 && <span className="filter-count-pill">{activeFiltersCount}</span>}
          </button>
        </div>

        {/* Left Sidebar Filters */}
        <aside className={`products-sidebar ${mobileFiltersOpen ? 'mobile-visible' : ''}`}>
          <div className="sidebar-header-card">
            <div className="sidebar-header-title">
              <h3>Filters</h3>
              {activeFiltersCount > 0 && (
                <span className="active-badge">{activeFiltersCount} active</span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={handleClearFilters} className="clear-filters-link" type="button">
                Reset All ↺
              </button>
            )}
          </div>

          {/* Categories Section */}
          <div className="sidebar-filter-block">
            <div className="block-title">
              <span>Categories</span>
            </div>
            <div className="categories-filter-list">
              {CATEGORIES.map((cat) => {
                const isActive = categoryParam === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    className={`category-filter-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      updateParam('category', cat.name);
                      setMobileFiltersOpen(false);
                    }}
                  >
                    <span className="cat-item-left">
                      <span className="cat-icon-badge">{cat.icon}</span>
                      <span className="cat-label-text">{cat.label}</span>
                    </span>
                    <span className="cat-count-pill">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories in Sidebar */}
          {categoryParam !== 'All' && SUBCATEGORIES_MAP[categoryParam] && (
            <div className="sidebar-filter-block subcategories-block">
              <div className="block-title">
                <span>Sub-Categories</span>
              </div>
              <div className="subcategories-filter-list">
                {SUBCATEGORIES_MAP[categoryParam].map((sub) => {
                  const isActive = subcategoryParam === sub.value;
                  return (
                    <button
                      key={sub.value}
                      type="button"
                      className={`subcategory-filter-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        updateParam('subcategory', sub.value);
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <span className="sub-item-left">
                        <span className="sub-icon-badge">{sub.icon}</span>
                        <span className="sub-label-text">{sub.label}</span>
                      </span>
                      {isActive && <span className="sub-active-dot">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range Section */}
          <div className="sidebar-filter-block">
            <div className="block-title">
              <span>Price Range (₹)</span>
            </div>
            <div className="price-filter-list">
              {PRICE_RANGES.map((range) => {
                const isSelected =
                  (range.min === '' && !minPriceParam && !maxPriceParam) ||
                  (range.min === minPriceParam && range.max === maxPriceParam);

                return (
                  <label
                    key={range.label}
                    className={`price-radio-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handlePriceRange(range)}
                  >
                    <span className="radio-circle">
                      {isSelected && <span className="radio-dot" />}
                    </span>
                    <span className="price-label-text">{range.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Custom Price Range Input */}
            <form onSubmit={handleApplyCustomPrice} className="custom-price-form">
              <div className="custom-inputs-row">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={customMin}
                  onChange={(e) => setCustomMin(e.target.value)}
                  className="price-input-field"
                  min="0"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  className="price-input-field"
                  min="0"
                />
                <button type="submit" className="price-go-btn" title="Apply budget">
                  Go
                </button>
              </div>
            </form>
          </div>

          {/* Customer Rating Filter */}
          <div className="sidebar-filter-block">
            <div className="block-title">
              <span>Customer Rating</span>
            </div>
            <div className="rating-filter-list">
              {RATING_FILTERS.map((r) => {
                const isSelected = ratingParam === r.value;
                return (
                  <button
                    key={r.label}
                    type="button"
                    className={`rating-filter-item ${isSelected ? 'is-active' : ''}`}
                    onClick={() => updateParam('rating', r.value)}
                  >
                    <span className="rating-stars">{r.stars || '⭐'}</span>
                    <span className="rating-text">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fast Delivery Toggle */}
          <div className="sidebar-filter-block">
            <div className="block-title">
              <span>Delivery Speed</span>
            </div>
            <label className={`fast-delivery-toggle-card ${fastDeliveryParam ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={fastDeliveryParam}
                onChange={(e) => updateParam('fastDelivery', e.target.checked ? 'true' : '')}
                className="delivery-checkbox"
              />
              <div className="delivery-toggle-info">
                <span className="toggle-heading">⚡ Express / Next-Day Delivery</span>
                <span className="toggle-sub">Filter for same-day &amp; next-day items</span>
              </div>
            </label>
          </div>

          {/* Trust Guarantees */}
          <div className="sidebar-trust-box">
            <div className="trust-head">
              <span className="trust-head-icon">🛡️</span>
              <h4>BharatBazaar Promise</h4>
            </div>
            <ul className="trust-guarantees-list">
              <li>✔ BIS &amp; Made in India verified</li>
              <li>✔ Free delivery on orders ₹499+</li>
              <li>✔ 18% GST tax invoice for input credit</li>
              <li>✔ Safe Delivery 4-digit OTP protection</li>
              <li>✔ 7-Day easy doorstep replacements</li>
            </ul>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="products-main-col">
          {/* Quick Category Switcher Pills on Top */}
          <div className="quick-category-pills-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className={`quick-cat-pill ${categoryParam === cat.name ? 'active' : ''}`}
                onClick={() => updateParam('category', cat.name)}
              >
                <span className="pill-icon">{cat.icon}</span>
                <span className="pill-name">{cat.name === 'All' ? 'All Products' : cat.name}</span>
              </button>
            ))}
          </div>

          {/* Subcategory Pills Bar (Horizontal scrollable quick-filters) */}
          <div className="subcategory-pills-bar">
            <span className="subcat-bar-label">
              {categoryParam !== 'All' ? `${categoryParam}:` : 'Popular:'}
            </span>
            {(categoryParam !== 'All' && SUBCATEGORIES_MAP[categoryParam]
              ? SUBCATEGORIES_MAP[categoryParam]
              : POPULAR_SUBCATEGORIES_ALL
            ).map((sub) => {
              const isActive = subcategoryParam === sub.value;
              return (
                <button
                  key={sub.value + (sub.category || '')}
                  type="button"
                  className={`subcat-pill-chip ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (sub.category && categoryParam === 'All') {
                      const next = new URLSearchParams(searchParams);
                      next.set('category', sub.category);
                      if (sub.value !== 'All') next.set('subcategory', sub.value);
                      next.set('page', '1');
                      setSearchParams(next);
                    } else {
                      updateParam('subcategory', sub.value);
                    }
                  }}
                >
                  <span className="subcat-chip-icon">{sub.icon}</span>
                  <span className="subcat-chip-name">{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Chips Bar (if any active) */}
          {activeFiltersCount > 0 && (
            <div className="active-filter-chips-row">
              <span className="active-label">Applied Filters:</span>
              {categoryParam !== 'All' && (
                <span className="filter-chip">
                  Category: {categoryParam}
                  <button type="button" onClick={() => updateParam('category', 'All')}>✕</button>
                </span>
              )}
              {subcategoryParam !== 'All' && (
                <span className="filter-chip filter-chip-subcat">
                  Sub-Category: {subcategoryParam}
                  <button type="button" onClick={() => updateParam('subcategory', 'All')}>✕</button>
                </span>
              )}
              {(minPriceParam || maxPriceParam) && (
                <span className="filter-chip">
                  Price: ₹{minPriceParam || '0'} - ₹{maxPriceParam || 'Max'}
                  <button type="button" onClick={() => handlePriceRange({ min: '', max: '' })}>✕</button>
                </span>
              )}
              {ratingParam && (
                <span className="filter-chip">
                  Rating: {ratingParam}★ &amp; up
                  <button type="button" onClick={() => updateParam('rating', '')}>✕</button>
                </span>
              )}
              {fastDeliveryParam && (
                <span className="filter-chip">
                  ⚡ Express Delivery Only
                  <button type="button" onClick={() => updateParam('fastDelivery', '')}>✕</button>
                </span>
              )}
              {searchParam && (
                <span className="filter-chip">
                  Search: "{searchParam}"
                  <button type="button" onClick={() => updateParam('search', '')}>✕</button>
                </span>
              )}
              <button type="button" className="clear-all-chip-btn" onClick={handleClearFilters}>
                Clear All ✕
              </button>
            </div>
          )}

          {/* Active Filters & Sorting Bar */}
          <div className="catalog-toolbar">
            <div className="toolbar-count">
              Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
              {categoryParam !== 'All' && <span className="active-cat-badge"> in {categoryParam}</span>}
              {subcategoryParam !== 'All' && <span className="active-subcat-badge"> › {subcategoryParam}</span>}
              {searchParam && <span className="active-cat-badge"> matching "{searchParam}"</span>}
            </div>

            <div className="toolbar-sort">
              <label htmlFor="sortSelect">Sort By:</label>
              <select
                id="sortSelect"
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured Deals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated ★</option>
                <option value="discount">Biggest Discount %</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid-catalog">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-skeleton-card"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="no-products-state">
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>We couldn't find any products matching your selected filters.</p>
              <button onClick={handleClearFilters} className="btn btn-primary" type="button">
                Reset Filters ↺
              </button>
            </div>
          ) : (
            <div className="products-grid-catalog">
              {products.map((product) => {
                const prodId = product._id || product.id;
                const inWishlist = isInWishlist(prodId);
                const comparing = isComparing(prodId);
                const { amount: savingsAmount, percent: savingsPercent } = calculateSavings(
                  product.mrp,
                  product.price
                );

                return (
                  <div key={prodId} className="catalog-product-card">
                    {/* Image Area */}
                    <div className="catalog-img-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="catalog-img"
                        loading="lazy"
                      />

                      {product.badge && <span className="catalog-badge">{product.badge}</span>}
                      <span className="catalog-origin">Made in India 🇮🇳</span>

                      <button
                        type="button"
                        className={`catalog-wishlist-btn ${inWishlist ? 'active' : ''}`}
                        onClick={() => handleToggleWishlist(prodId, product.name)}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        {inWishlist ? '❤️' : '🤍'}
                      </button>

                      <button
                        type="button"
                        className="catalog-quickview-btn"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Quick View 👁️
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="catalog-card-body">
                      <div className="catalog-tag-badges-row">
                        <span className="catalog-cat-pill">{product.category}</span>
                        {product.subcategory && (
                          <button
                            type="button"
                            className="catalog-subcat-badge-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateParam('subcategory', product.subcategory);
                            }}
                            title={`Filter by ${product.subcategory}`}
                          >
                            {product.subcategory}
                          </button>
                        )}
                      </div>
                      <h3
                        className="catalog-prod-title"
                        title={product.name}
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Ratings & Brand */}
                      <div className="catalog-meta-row">
                        <div className="star-rating-pill">
                          <span className="star-icon">★</span>
                          <span className="star-val">{product.rating ? Number(product.rating).toFixed(1) : '4.3'}</span>
                          <span className="reviews-cnt">({product.reviewsCount || 120})</span>
                        </div>
                        <span className="brand-badge-pill">{product.brand || 'BharatBazaar'}</span>
                      </div>

                      {/* Pricing */}
                      <div className="catalog-price-container">
                        <div className="price-main-line">
                          <span className="deal-price">{formatINR(product.price)}</span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="mrp-price">{formatINR(product.mrp)}</span>
                          )}
                        </div>
                        {savingsAmount > 0 && (
                          <div className="savings-tag">Save {formatINR(savingsAmount)} ({savingsPercent}% OFF)</div>
                        )}
                      </div>

                      <div className="delivery-speed-tag">{getDeliverySpeed(product)}</div>

                      {/* Add to Cart & 1-Click Buy Now */}
                      <div className="catalog-card-actions">
                        <button
                          type="button"
                          className="btn btn-catalog-add"
                          onClick={() => handleAddToCart(prodId, 1, product.name)}
                          disabled={addingId === prodId}
                        >
                          {addingId === prodId ? '...' : 'Add 🛒'}
                        </button>
                        <button
                          type="button"
                          className="btn-catalog-buy-now"
                          onClick={() => handleBuyNow(prodId, product.name)}
                          disabled={addingId === prodId}
                        >
                          ⚡ Buy Now
                        </button>
                      </div>

                      {/* Compare Button */}
                      <button
                        type="button"
                        className={`btn-catalog-compare ${comparing ? 'active' : ''}`}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="pagination-btn nav-btn"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                ← Prev
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span className="pagination-ellipsis">...</span>}
                        <button
                          type="button"
                          className={`pagination-num-btn ${page === p ? 'active' : ''}`}
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                type="button"
                className="pagination-btn nav-btn"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next →
              </button>
            </div>
          )}

          {/* Recently Viewed Products Section */}
          {recentlyViewed.length > 0 && (
            <div className="recently-viewed-section">
              <div className="recently-viewed-header">
                <h3>🕒 Recently Viewed Products</h3>
                <span>Items you checked during this session</span>
              </div>
              <div className="recently-viewed-grid">
                {recentlyViewed.map((prod) => (
                  <div
                    key={prod._id || prod.id}
                    className="recent-product-card"
                    onClick={() => setSelectedProduct(prod)}
                  >
                    <img src={prod.image} alt={prod.name} className="recent-thumb" />
                    <span className="recent-cat">{prod.category}</span>
                    <h4 className="recent-title">{prod.name}</h4>
                    <div className="recent-price-row">
                      <span className="recent-price">{formatINR(prod.price)}</span>
                      {prod.mrp && prod.mrp > prod.price && (
                        <span className="recent-mrp">{formatINR(prod.mrp)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
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

export default Products;
