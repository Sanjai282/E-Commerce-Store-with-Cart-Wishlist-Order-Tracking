import React, { useState } from 'react';
import '../styles/StudentProjectModal.css';

const StudentProjectModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture' | 'checklist' | 'viva'

  return (
    <div className="student-modal-backdrop" onClick={onClose}>
      <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="student-modal-header">
          <div className="student-badge-row">
            <span className="academic-badge">🎓 FINAL YEAR / CAPSTONE PROJECT</span>
            <span className="academic-year">Academic Session 2025–2026</span>
          </div>
          <div className="student-title-row">
            <div>
              <h2>BharatBazaar: Indian E-Commerce Web System</h2>
              <p className="academic-subtitle">
                Designed &amp; Developed with MERN Stack • React 19 • Node/Express • Dual-Mode Database
              </p>
            </div>
            <button className="student-modal-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="student-nav-tabs">
            <button
              type="button"
              className={`student-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📋 Project Overview
            </button>
            <button
              type="button"
              className={`student-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
              onClick={() => setActiveTab('architecture')}
            >
              🏗️ System Architecture
            </button>
            <button
              type="button"
              className={`student-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
              onClick={() => setActiveTab('checklist')}
            >
              🧪 Evaluator Live Test Script
            </button>
            <button
              type="button"
              className={`student-tab-btn ${activeTab === 'viva' ? 'active' : ''}`}
              onClick={() => setActiveTab('viva')}
            >
              💡 Viva Voce Q&amp;A
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="student-modal-body">
          {/* TAB 1: Project Overview */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="academic-meta-grid">
                <div className="meta-card">
                  <span className="meta-icon">🎯</span>
                  <strong>Project Objective</strong>
                  <p>
                    To engineer a robust, enterprise-ready Indian e-commerce application overcoming western template limitations with native INR (₹), 18% GST invoicing, PIN code logistics, and multi-mode Indian payments.
                  </p>
                </div>

                <div className="meta-card">
                  <span className="meta-icon">💻</span>
                  <strong>Primary Tech Stack</strong>
                  <p>
                    React 19 (Frontend), Node.js &amp; Express.js (REST Backend), Context API (State Management), MongoDB with Resilient File-Store Fallback.
                  </p>
                </div>

                <div className="meta-card">
                  <span className="meta-icon">⚙️</span>
                  <strong>Key Innovation</strong>
                  <p>
                    Dual-Mode Database Architecture ensuring 100% demo uptime on any evaluator computer even when local MongoDB services are not installed or active.
                  </p>
                </div>
              </div>

              <div className="student-section-block">
                <h3>Key Modules Implemented</h3>
                <div className="modules-list-grid">
                  <div className="module-item">
                    <span className="mod-num">01</span>
                    <div>
                      <strong>Authentication &amp; User Profile</strong>
                      <p>JWT-based auth, Bcrypt password hashing, pre-loaded 1-Click Demo accounts, and multiple saved Indian addresses.</p>
                    </div>
                  </div>

                  <div className="module-item">
                    <span className="mod-num">02</span>
                    <div>
                      <strong>Indian Product Catalog &amp; Comparison</strong>
                      <p>22+ authentic Indian products across 5 verticals with HSN codes, warranty, specs matrix, and 3-item side-by-side comparison drawer.</p>
                    </div>
                  </div>

                  <div className="module-item">
                    <span className="mod-num">03</span>
                    <div>
                      <strong>Cart, Wishlist &amp; 1-Click Buy Now</strong>
                      <p>Full persistent shopping cart, wishlist manager, festive coupons (`INDIA100`), and direct 1-click checkout bypass.</p>
                    </div>
                  </div>

                  <div className="module-item">
                    <span className="mod-num">04</span>
                    <div>
                      <strong>Indian Logistics &amp; PIN Lookup</strong>
                      <p>Auto-detects city and state from 6-digit PIN codes across 28,000+ postal zones; computes next-day delivery times.</p>
                    </div>
                  </div>

                  <div className="module-item">
                    <span className="mod-num">05</span>
                    <div>
                      <strong>Indian Payment Simulation</strong>
                      <p>Dynamic UPI QR generation (GPay, PhonePe, Paytm), RuPay debit/credit card engine, Net Banking, and COD with anti-fraud captcha.</p>
                    </div>
                  </div>

                  <div className="module-item">
                    <span className="mod-num">06</span>
                    <div>
                      <strong>Live Tracking &amp; GST Tax Invoice</strong>
                      <p>Delhivery tracking milestones, delivery associate card, Safe OTP verification, and print-ready 18% GST B2C/B2B tax invoice.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: System Architecture */}
          {activeTab === 'architecture' && (
            <div className="tab-pane">
              <div className="student-section-block">
                <h3>Multi-Tier System Architecture</h3>
                <div className="architecture-diagram-card">
                  <div className="arch-tier-box client-tier">
                    <div className="tier-badge">CLIENT TIER (Port 3000)</div>
                    <strong>React 19 SPA (Single Page Application)</strong>
                    <div className="tier-chips">
                      <span>React Router v6</span>
                      <span>AuthContext</span>
                      <span>CartContext</span>
                      <span>CompareContext</span>
                      <span>ToastContext</span>
                      <span>Axios Interceptors</span>
                    </div>
                  </div>

                  <div className="arch-arrow">⇅ REST API Calls (JSON / Bearer Token) ⇅</div>

                  <div className="arch-tier-box server-tier">
                    <div className="tier-badge">BACKEND SERVER TIER (Port 5002)</div>
                    <strong>Node.js &amp; Express RESTful API</strong>
                    <div className="tier-chips">
                      <span>ProductController</span>
                      <span>CartController</span>
                      <span>OrderController</span>
                      <span>AuthController</span>
                      <span>PincodeController</span>
                      <span>CouponController</span>
                    </div>
                  </div>

                  <div className="arch-arrow">⇅ Intelligent Database Adapter (`dbStore.js`) ⇅</div>

                  <div className="arch-tier-box db-tier">
                    <div className="tier-badge">DATA PERSISTENCE TIER</div>
                    <div className="dual-db-columns">
                      <div className="db-sub-col">
                        <span className="db-status online">Mode A (Online)</span>
                        <strong>MongoDB / Mongoose</strong>
                        <p>Used when local `mongod` service (27017) or cloud MongoDB Atlas is reachable.</p>
                      </div>
                      <div className="db-divider">OR</div>
                      <div className="db-sub-col">
                        <span className="db-status fallback">Mode B (Zero-Config Fallback)</span>
                        <strong>Embedded JSON Data Engine</strong>
                        <p>Thread-safe file store (`data/store.json`). Guarantees 100% demo success anywhere.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-section-block">
                <h3>Database Entities &amp; Schemas</h3>
                <ul className="schema-bullets">
                  <li><strong>Users:</strong> `id, name, email, password (hashed), phone (+91), addresses[] (Home/Work)`</li>
                  <li><strong>Products:</strong> `id, name, description, price, mrp, category, stock, hsnCode, gstRate (18%), specifications{}, reviews[]`</li>
                  <li><strong>Orders:</strong> `orderId, items[], subtotal, discount, couponCode, cgst (9%), sgst (9%), shipping, totalAmount, status, paymentMethod, deliveryAssociate{}, transitRoute[], deliveryOtp`</li>
                  <li><strong>Coupons:</strong> `code, flatDiscount, discountPercent, minOrderValue, maxDiscount`</li>
                  <li><strong>Pincodes:</strong> `pincode, city, state, deliveryTime, codAvailable, hub`</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Evaluator Live Test Script */}
          {activeTab === 'checklist' && (
            <div className="tab-pane">
              <div className="test-guide-intro">
                <h4>👨‍🏫 Evaluator's 3-Minute Live Feature Verification Script</h4>
                <p>Follow these quick sequential steps to inspect all implemented technical requirements:</p>
              </div>

              <div className="test-steps-timeline">
                <div className="test-step-card">
                  <div className="step-num-pill">Step 1</div>
                  <div className="step-content">
                    <strong>1-Click Demo Login</strong>
                    <p>Go to the Login page. Click the amber <strong>"⚡ Demo: Aarav Sharma (Mumbai)"</strong> button. Notice the token generation and pre-loaded profile with saved addresses.</p>
                  </div>
                </div>

                <div className="test-step-card">
                  <div className="step-num-pill">Step 2</div>
                  <div className="step-content">
                    <strong>Catalog Browsing &amp; Filters</strong>
                    <p>Navigate to "Explore Products". Test Category filtering (Electronics, Ethnic Wear, Cookware, Ayurveda, Groceries) and Price Range sorting.</p>
                  </div>
                </div>

                <div className="test-step-card">
                  <div className="step-num-pill">Step 3</div>
                  <div className="step-content">
                    <strong>Product Comparison Engine</strong>
                    <p>Click <strong>"⚖️ Compare"</strong> on any 2 or 3 products. Notice the floating bottom dock. Click "Compare Now" to view the side-by-side technical specification matrix.</p>
                  </div>
                </div>

                <div className="test-step-card">
                  <div className="step-num-pill">Step 4</div>
                  <div className="step-content">
                    <strong>Customer Review Submission</strong>
                    <p>Open any product Quick View. Scroll down to Customer Reviews. Click <strong>"✍️ Write a Review"</strong>, choose 5 stars, type feedback, and submit. Notice immediate persistence.</p>
                  </div>
                </div>

                <div className="test-step-card">
                  <div className="step-num-pill">Step 5</div>
                  <div className="step-content">
                    <strong>6-Digit PIN Code Auto-Lookup &amp; 1-Click Buy Now</strong>
                    <p>Click <strong>"⚡ Buy Now"</strong> on any item to jump straight to Checkout. Select or add an address. Type PIN `560001` or `400001` to verify auto-detection of city/state.</p>
                  </div>
                </div>

                <div className="test-step-card">
                  <div className="step-num-pill">Step 6</div>
                  <div className="step-content">
                    <strong>Indian Payment Gateway &amp; Anti-Fraud Captcha</strong>
                    <p>Select **UPI** to scan the simulated QR, or **Cash on Delivery (COD)** with 4-digit anti-fraud captcha verification. Click "Place Order".</p>
                  </div>
                </div>

                <div className="test-step-card">
                  <div className="step-num-pill">Step 7</div>
                  <div className="step-content">
                    <strong>Live Courier Tracking &amp; Printable GST Tax Invoice</strong>
                    <p>On the "My Orders" screen, inspect the Delhivery Express status tracker, Delivery Associate card (*Rajesh Kumar*), and Safe OTP. Click <strong>"View GST Invoice"</strong> to see compliant 18% CGST/SGST tax sheet.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Viva Voce Q&A */}
          {activeTab === 'viva' && (
            <div className="tab-pane">
              <div className="viva-intro">
                <h4>💡 Top Technical Viva Voce Questions &amp; Model Answers</h4>
                <p>Standard questions frequently asked during final year capstone examinations:</p>
              </div>

              <div className="viva-qa-list">
                <div className="viva-qa-item">
                  <span className="viva-q">Q1: How did you handle database connectivity when MongoDB is unavailable during demonstrations?</span>
                  <p className="viva-a">
                    <strong>Answer:</strong> We implemented an intelligent dual-mode database repository pattern (`data/dbStore.js`). On startup, the backend attempts to connect to MongoDB via Mongoose. If connection fails or times out, it transparently routes all CRUD operations to a resilient embedded JSON store (`data/store.json`). This ensures 100% demo reliability on any evaluator computer.
                  </p>
                </div>

                <div className="viva-qa-item">
                  <span className="viva-q">Q2: How does the Indian GST calculation work in your pricing engine?</span>
                  <p className="viva-a">
                    <strong>Answer:</strong> Each item in the catalog has an assigned Indian HSN code and an 18% GST rate. During checkout and order generation, the total tax is computed as `subtotal * 0.18`, and strictly divided into 9% CGST (Central Goods and Services Tax) and 9% SGST (State Goods and Services Tax). Both components are itemized on the printable GST Tax Invoice along with the company GSTIN.
                  </p>
                </div>

                <div className="viva-qa-item">
                  <span className="viva-q">Q3: Why did you choose React Context API over Redux for state management?</span>
                  <p className="viva-a">
                    <strong>Answer:</strong> Context API (`AuthContext`, `CartContext`, `WishlistContext`, `CompareContext`) is native to React, eliminating external package overhead, reducing bundle size, and ensuring seamless compatibility with React 19. It provides modular separation of concerns without boilerplate actions/reducers.
                  </p>
                </div>

                <div className="viva-qa-item">
                  <span className="viva-q">Q4: How is the 6-digit PIN code lookup implemented?</span>
                  <p className="viva-a">
                    <strong>Answer:</strong> We engineered a specialized endpoint `GET /api/pincode/:code` backed by an in-memory indexed directory (`data/pincodesData.js`) covering over 28,000 Indian postal codes. When the customer enters 6 digits, an asynchronous lookup executes with debouncing to auto-populate City, State, COD availability, and estimated transit days in under 5ms.
                  </p>
                </div>

                <div className="viva-qa-item">
                  <span className="viva-q">Q5: How does the application ensure security and anti-fraud in Indian payments?</span>
                  <p className="viva-a">
                    <strong>Answer:</strong> For authentication, we utilize JWT tokens stored in localStorage with Axios request interceptors and Bcrypt salted password hashing. For Cash on Delivery, we implemented anti-fraud captcha verification to prevent automated bot orders, and a Safe Delivery 4-digit OTP that the customer must present to the courier before delivery confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="student-modal-footer">
          <div className="footer-student-note">
            <span>💡 <strong>Academic Note:</strong> Source code is structured following standard MVC architecture for university submission.</span>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Close Showcase ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProjectModal;
