import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/indianUtils';
import PincodeModal from './PincodeModal';
import '../styles/Navbar.css';

const CATEGORIES = [
  { label: 'All Products', value: 'All', icon: '⚡' },
  { label: 'Electronics', value: 'Electronics', icon: '🎧' },
  { label: 'Ethnic Fashion', value: 'Ethnic Fashion', icon: '🥻' },
  { label: 'Home & Kitchen', value: 'Home & Kitchen', icon: '🍳' },
  { label: 'Ayurveda & Beauty', value: 'Ayurveda & Beauty', icon: '🌿' },
  { label: 'Daily Groceries', value: 'Daily Groceries', icon: '☕' }
];

const SUBCATEGORIES_NAV = {
  'Electronics': [
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
    { label: 'Banarasi Sarees', value: 'Banarasi Sarees', icon: '🥻' },
    { label: 'Kanchipuram Silk Sarees', value: 'Kanchipuram Silk Sarees', icon: '🌸' },
    { label: 'Kurtas & Kurtis', value: 'Kurtas & Kurtis', icon: '👗' },
    { label: 'Anarkali Sets', value: 'Anarkali Sets', icon: '💃' },
    { label: "Men's Sherwanis", value: "Men's Sherwanis", icon: '🤵' },
    { label: "Men's Kurtas & Pyjamas", value: "Men's Kurtas & Pyjamas", icon: '👔' },
    { label: 'Bridal Lehengas', value: 'Bridal Lehengas', icon: '👑' }
  ],
  'Home & Kitchen': [
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
    { label: 'Radiance Creams', value: 'Radiance Creams', icon: '✨' },
    { label: 'Facial Serums', value: 'Facial Serums', icon: '💧' },
    { label: 'Rosewater & Toners', value: 'Rosewater & Toners', icon: '🌹' },
    { label: 'Ayurvedic Hair Oils', value: 'Ayurvedic Hair Oils', icon: '🧴' },
    { label: 'Herbal Soaps', value: 'Herbal Soaps', icon: '🧼' },
    { label: 'Chyawanprash & Immunity', value: 'Chyawanprash & Immunity', icon: '🌿' }
  ],
  'Daily Groceries': [
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

const Navbar = () => {
  const { user, logout, deliveryPincode, deliveryCity, updateLocation, demoLogin } = useAuth();
  const { getCartCount, getCartTotal } = useCart();
  const { wishlist } = useWishlist();
  const { success, info } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const wishlistCount = wishlist.length;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set('search', searchTerm.trim());
    if (selectedCategory && selectedCategory !== 'All') query.set('category', selectedCategory);
    navigate(`/products?${query.toString()}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully. See you again soon!');
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleQuickDemoLogin = async (email, name) => {
    try {
      await demoLogin(email);
      success(`Switched to Demo Account: ${name}`);
      setUserDropdownOpen(false);
    } catch (err) {
      info('Could not switch demo user');
    }
  };

  return (
    <>
      {/* Top Festive Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="marquee-badge">🇮🇳 GREAT INDIAN FESTIVAL</span>
          <span className="marquee-text">
            Flat <strong>₹100 OFF</strong> on orders ₹799+ with code <strong>INDIA100</strong> | Free Delivery across 28,000+ PIN codes above ₹499 | 100% Genuine Indian Brands
          </span>
          <div className="announcement-links">
            <span className="helpline-text">📞 24x7 Customer Care: 1800-889-2026</span>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="navbar-main-container">
          {/* Mobile hamburger */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-logo-badge">
              <span className="brand-flag">🇮🇳</span>
              <div className="brand-text-col">
                <span className="brand-name">
                  Bharat<span className="brand-accent">Bazaar</span>
                </span>
                <span className="brand-tagline">India's Trusted Online Megastore</span>
              </div>
            </div>
          </Link>

          {/* Delivery Location Selector */}
          <button
            type="button"
            className="location-pill-btn"
            onClick={() => setShowPincodeModal(true)}
            title="Click to change delivery location"
          >
            <span className="location-icon">📍</span>
            <div className="location-text-col">
              <span className="deliver-to-label">Deliver to</span>
              <span className="delivery-destination">
                {deliveryCity} {deliveryPincode}
              </span>
            </div>
          </button>

          {/* Indian Search Bar with Category Dropdown */}
          <form className="search-form-bar" onSubmit={handleSearch}>
            <select
              className="search-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search 20,000+ products (e.g. boAt headphones, Banarasi saree, Tata Tea)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-field"
            />
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-svg">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>

          {/* Right Navigation Actions */}
          <div className="navbar-actions">
            {/* User Profile or Login */}
            {user ? (
              <div className="user-dropdown-wrapper">
                <button
                  type="button"
                  className="user-trigger-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span className="user-avatar-initial">
                    {(user.name || 'User').charAt(0).toUpperCase()}
                  </span>
                  <div className="user-greeting-col">
                    <span className="greeting-text">Hello,</span>
                    <span className="user-display-name">{(user.name || 'Customer').split(' ')[0]} ▾</span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-header">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                      <span className="dropdown-phone">{user.phone || '+91 98765 43210'}</span>
                    </div>

                    <Link to="/orders" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                      📦 My Orders &amp; Tracking
                    </Link>
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                      ❤️ Wishlist ({wishlistCount})
                    </Link>

                    <div className="dropdown-divider"></div>
                    <div className="demo-switch-header">Switch Demo User:</div>
                    <button
                      type="button"
                      className="demo-switch-btn"
                      onClick={() => handleQuickDemoLogin('aarav@bharatbazaar.in', 'Aarav Sharma (Mumbai)')}
                    >
                      👤 Aarav Sharma (Mumbai)
                    </button>
                    <button
                      type="button"
                      className="demo-switch-btn"
                      onClick={() => handleQuickDemoLogin('priya@bharatbazaar.in', 'Priya Patel (Bengaluru)')}
                    >
                      👤 Priya Patel (Bengaluru)
                    </button>

                    <div className="dropdown-divider"></div>
                    <button type="button" className="dropdown-item logout-btn" onClick={handleLogout}>
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-group">
                <Link to="/login" className="btn btn-login-nav">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-register-nav">
                  Register
                </Link>
              </div>
            )}

            {/* Wishlist Button */}
            <Link to="/wishlist" className="action-nav-item wishlist-nav-item" title="Wishlist">
              <span className="nav-item-icon">❤️</span>
              <span className="nav-item-label">Wishlist</span>
              {wishlistCount > 0 && <span className="nav-badge wishlist-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart Button with Total */}
            <Link to="/cart" className="action-nav-item cart-nav-item" title="Shopping Cart">
              <div className="cart-icon-container">
                <span className="nav-item-icon">🛒</span>
                {cartCount > 0 && <span className="nav-badge cart-badge">{cartCount}</span>}
              </div>
              <div className="cart-total-col">
                <span className="nav-item-label">Cart</span>
                <span className="nav-cart-amount">{cartTotal > 0 ? formatINR(cartTotal) : '₹0'}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Secondary Category Navigation Strip */}
        <div className={`categories-subnav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="categories-subnav-container">
            <Link
              to="/products"
              className="category-nav-link all-products-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="cat-icon">☰</span>
              <span>All Products</span>
            </Link>

            {CATEGORIES.filter((c) => c.value !== 'All').map((cat) => {
              const subcats = SUBCATEGORIES_NAV[cat.value] || [];
              return (
                <div key={cat.value} className="nav-cat-dropdown-wrapper">
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.value)}`}
                    className="category-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span>{cat.label}</span>
                    {subcats.length > 0 && <span className="nav-dropdown-caret">▾</span>}
                  </Link>
                  {subcats.length > 0 && (
                    <div className="nav-subcat-mega-dropdown">
                      <div className="mega-dropdown-header">
                        <span className="mega-dropdown-title">{cat.icon} {cat.label} Sub-categories</span>
                        <Link
                          to={`/products?category=${encodeURIComponent(cat.value)}`}
                          className="mega-view-all"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          View All ({cat.value === 'Electronics' ? '100' : '100'}) →
                        </Link>
                      </div>
                      <div className="mega-subcats-grid">
                        {subcats.map((sub) => (
                          <Link
                            key={sub.value}
                            to={`/products?category=${encodeURIComponent(cat.value)}&subcategory=${encodeURIComponent(sub.value)}`}
                            className="mega-subcat-item"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="mega-subcat-icon">{sub.icon}</span>
                            <span className="mega-subcat-name">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              to="/orders"
              className="category-nav-link orders-direct-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>🚚 Track Order</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Pincode Change Modal */}
      {showPincodeModal && (
        <PincodeModal
          currentPincode={deliveryPincode}
          currentCity={deliveryCity}
          onSave={updateLocation}
          onClose={() => setShowPincodeModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
