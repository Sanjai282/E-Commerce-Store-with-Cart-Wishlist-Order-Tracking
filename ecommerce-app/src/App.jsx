import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
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
                <footer className="footer">
                  <div className="footer-content">
                    <div className="footer-brand">
                      <span className="footer-logo">🛒 E-Store</span>
                      <p className="footer-tagline">Your one-stop shop for everything</p>
                    </div>
                    <div className="footer-links">
                      <a href="#privacy">Privacy Policy</a>
                      <a href="#terms">Terms of Service</a>
                      <a href="#contact">Contact Us</a>
                    </div>
                    <p className="footer-copyright">&copy; 2024 E-Store. All rights reserved.</p>
                  </div>
                </footer>
              </div>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
