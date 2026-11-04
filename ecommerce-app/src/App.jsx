import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import CompareModal from './components/CompareModal';
import SanjaiChatbot from './components/SanjaiChatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <ToastProvider>
                <div className="App">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <CompareModal />
                  <SanjaiChatbot />

                  <footer className="footer-india">
                  {/* Footer Features Bar */}
                  <div className="footer-features-bar">
                    <div className="footer-features-container">
                      <div className="footer-feature-box">
                        <span className="feature-ico">🇮🇳</span>
                        <div>
                          <strong>Proudly Indian</strong>
                          <p>Empowering local brands &amp; artisans</p>
                        </div>
                      </div>
                      <div className="footer-feature-box">
                        <span className="feature-ico">🚚</span>
                        <div>
                          <strong>Free Delivery on ₹499+</strong>
                          <p>Delivering across 28,000+ PIN codes</p>
                        </div>
                      </div>
                      <div className="footer-feature-box">
                        <span className="feature-ico">🛡️</span>
                        <div>
                          <strong>100% Purchase Protection</strong>
                          <p>7-Day Easy Doorstep Returns</p>
                        </div>
                      </div>
                      <div className="footer-feature-box">
                        <span className="feature-ico">⚡</span>
                        <div>
                          <strong>Instant UPI &amp; COD</strong>
                          <p>Pay with Cash, GPay, PhonePe or RuPay</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Footer Links */}
                  <div className="footer-main-container">
                    <div className="footer-grid-cols">
                      {/* Brand Info */}
                      <div className="footer-col brand-col">
                        <div className="footer-brand-title">
                          <span className="footer-flag">🇮🇳</span>
                          <h3>BharatBazaar</h3>
                        </div>
                        <p className="footer-brand-desc">
                          India’s premier online marketplace for authentic indigenous brands, handwoven textiles, festive electronics, and everyday pantry essentials.
                        </p>
                        <p className="footer-reg-info">
                          <strong>Registered Office:</strong><br />
                          BharatBazaar Retail India Pvt. Ltd.<br />
                          Plot No. 44, Okhla Industrial Area Phase-III,<br />
                          New Delhi - 110020, India<br />
                          CIN: U52100DL2024PTC345678 | GSTIN: 07AABCB9123F1Z4
                        </p>
                      </div>

                      {/* Quick Links */}
                      <div className="footer-col">
                        <h4>Popular Departments</h4>
                        <ul>
                          <li><Link to="/products?category=Electronics">Electronics &amp; Audio</Link></li>
                          <li><Link to="/products?category=Ethnic%20Fashion">Banarasi Sarees &amp; Kurtas</Link></li>
                          <li><Link to="/products?category=Home%20%26%20Kitchen">Prestige Cookware</Link></li>
                          <li><Link to="/products?category=Ayurveda%20%26%20Beauty">Kama &amp; Forest Essentials</Link></li>
                          <li><Link to="/products?category=Daily%20Groceries">Tata Tea &amp; Desi Ghee</Link></li>
                        </ul>
                      </div>

                      {/* Customer Care */}
                      <div className="footer-col">
                        <h4>Customer Care</h4>
                        <ul>
                          <li><Link to="/orders">Track Your Shipment</Link></li>
                          <li><Link to="/orders">Returns &amp; Replacements</Link></li>
                          <li><a href="#shipping">Indian Shipping Rates</a></li>
                          <li><a href="#help">24x7 Customer Helpline: 1800-889-2026</a></li>
                          <li><a href="#email">care@bharatbazaar.in</a></li>
                        </ul>
                      </div>

                      {/* Payment Partners */}
                      <div className="footer-col">
                        <h4>100% Safe Payments</h4>
                        <div className="payment-badges-grid">
                          <span className="pay-chip">UPI</span>
                          <span className="pay-chip">Google Pay</span>
                          <span className="pay-chip">PhonePe</span>
                          <span className="pay-chip">Paytm</span>
                          <span className="pay-chip">RuPay 🇮🇳</span>
                          <span className="pay-chip">Net Banking</span>
                          <span className="pay-chip">Cash on Delivery</span>
                        </div>
                        <div className="app-download-note">
                          <small>🔒 Verified by Visa &amp; RuPay Secure 3D-Secure Authenticated</small>
                        </div>
                      </div>
                    </div>

                    <div className="footer-bottom-bar">
                      <p>&copy; 2026 BharatBazaar Retail India Pvt. Ltd. All rights reserved.</p>
                      <div className="footer-legal-links">
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Sale</a>
                        <a href="#gst">GST Compliance</a>
                        <a href="#security">Security</a>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </ToastProvider>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;
