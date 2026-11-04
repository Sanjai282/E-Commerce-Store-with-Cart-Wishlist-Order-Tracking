# 🇮🇳 BharatBazaar - Premium Indian E-Commerce Store
### Optimized & Enhanced with Full Indian Localization, Multi-Method Payments, Real-Time Courier Tracking & GST Invoicing

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-v4.18-blue.svg)](https://expressjs.com/)
[![Currency](https://img.shields.io/badge/Currency-INR%20%E2%82%B9-orange.svg)]()
[![GST](https://img.shields.io/badge/GST-18%25%20Compliant-emerald.svg)]()
[![Logistics](https://img.shields.io/badge/Logistics-Delhivery%20%7C%20Blue%20Dart-red.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**BharatBazaar** is a full-stack, enterprise-grade Indian E-Commerce web application adapted, localized, and enhanced from `sam-black007/E-Commerce-Store-with-Cart-Wishlist-Order-Tracking`.

---

## 🚀 What Has Been Optimized & Enhanced for the Indian Market

### 1. 🇮🇳 Full Indian Currency & Pricing Localization
- **Currency (`₹` INR)** formatted using the standard Indian numbering system (e.g. `₹1,499`, `₹12,499`, `₹1,24,990`).
- **MRP vs Deal Price**: Every product displays original M.R.P. with strikethrough, festive deal price, and real-time savings tag (`Save ₹1,700 - 60% OFF`).
- **Indian GST (18%) Calculation**: Transparent breakdown showing **CGST (9%) + SGST (9%)** on every cart, checkout review, and official invoice.
- **Indian Free Shipping Threshold**: Free delivery on orders above ₹499 (standard ₹49 courier fee otherwise).

### 2. 🛍️ Authentic Indian Product Catalog (22+ Handpicked Products)
Categorized across 5 prominent Indian consumer verticals:
1. **Electronics & Audio**: boAt Rockerz 550, Noise ColorFit Pulse 2 Max Smartwatch, OnePlus Nord Buds 2r, Mi 20000mAh Power Bank, Fire-Boltt calling watch, Portronics Bluetooth speaker.
2. **Ethnic Wear & Handloom**: Handcrafted Banarasi Silk Sarees (Varanasi), FabIndia Pure Cotton Handloom Kurtas, Manyavar Jacquard Silk Festive Sets, W for Woman Anarkalis.
3. **Home & Kitchen**: Prestige Svachh Deluxe Alpha Stainless Steel Pressure Cooker 3L, Milton Thermosteel Flask 1000ml, Hawkins Futura Hard Anodised Kadhai, Philips Rapid Air Fryer.
4. **Ayurveda & Beauty**: Kama Ayurveda Pure Kannauj Rose Water Mist, Mamaearth Onion Hair Fall Control Oil, Forest Essentials Kashmiri Saffron Cleanser, Biotique Bio Kelp Shampoo.
5. **Daily Groceries & Indian Pantry**: Tata Tea Gold Assam CTC, Haldiram's Nagpur Kaju Katli & Gulab Jamun Combo, Narasu's Udhayam South Indian Filter Coffee, Daawat Rozana Aged Basmati Rice.

### 3. 📍 Indian Address System with 6-Digit PIN Code Auto-Lookup
- **Automatic City & State Detection**: Type any 6-digit Indian PIN code (e.g., `400001` → Mumbai, Maharashtra; `560001` → Bengaluru, Karnataka; `110001` → Delhi), and the app auto-populates the city and state via `/api/pincode/:code`.
- Complete dropdown of all **36 Indian States and Union Territories**.
- 10-digit Indian mobile number validation with `+91` prefix.
- Landmark field (`Near Metro Station / Opposite Temple`) and Address Tagging (`Home` vs `Work / Commercial`).

### 4. 💳 Multi-Method Indian Payment System (Interactive Simulation)
- **Unified Payments Interface (UPI)**:
  - Dynamic QR code generation for scanning with any UPI app.
  - 1-Click UPI App buttons: **Google Pay, PhonePe, Paytm, BHIM, CRED**.
  - Enter and verify UPI VPA ID (e.g., `username@okhdfcbank`, `mobile@paytm`).
- **Cash on Delivery (COD)**:
  - Pay with Cash or UPI QR at doorstep.
  - Anti-fraud verification code (4-digit captcha) to confirm genuine Indian orders.
- **RuPay / Credit / Debit Cards**:
  - Full support and badge for **RuPay** (India's domestic card payment network) alongside Visa and Mastercard.
- **Net Banking**:
  - Major Indian Banks: **State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Punjab National Bank (PNB)**.

### 5. 🚚 Real-Time Indian Logistics Tracking & Safe Delivery OTP
- **Indian Courier Partners**: Delhivery Express, Blue Dart, DTDC, Xpressbees.
- **Unique AWB Tracking Code**: `DEL-XXXXXXXXXIN`.
- **4-Digit Safe Delivery OTP** (e.g. `OTP: 4829`) required upon doorstep delivery.
- **Visual Milestone Tracker**:
  1. *Order Confirmed*
  2. *Packed at Hub* (e.g. Bhiwandi Superhub / Okhla Logistics Park)
  3. *Shipped with Delhivery Express*
  4. *Out for Delivery*
  5. *Delivered (Safe OTP Verified)*
- **Interactive Status Simulator**: Test and toggle order progression in real time directly from the Orders page!

### 6. 📄 Official GST Tax Invoice Generator
- Compliant with Indian GST rules:
  - **Seller**: BharatBazaar Retail India Pvt. Ltd. (GSTIN: `07AABCB9123F1Z4`, State Code: `07`).
  - HSN/SAC codes for each product line.
  - Taxable value, CGST (9%), SGST (9%), Total Amount in INR.
  - One-click **Print / Save as PDF** tax receipt.

### 7. 🏷️ Indian Festive Coupon Engine
- `DESI100`: Flat ₹100 instant cash discount on minimum order of ₹799.
- `FESTIVE15`: 15% instant festive discount up to ₹500 on orders above ₹999.
- `FIRSTBUY`: Flat ₹150 OFF for first-time customers on orders above ₹999.
- `FREESHIP`: 100% Free Express Delivery across India on any cart value.
- Clickable coupon chips inside Cart and Checkout for 1-click application.

### 8. 👤 1-Click Quick Demo Login (Zero Setup Required)
- **Aarav Sharma**: Mumbai (`400001`) • `aarav@bharatbazaar.in` (password: `password123`)
- **Priya Patel**: Bengaluru (`560001`) • `priya@bharatbazaar.in` (password: `password123`)
- One-click demo login buttons on the Sign In page for instant testing without typing!

### 9. ⚡ Zero-Configuration Resilient Database
- **Dual Mode**: Connects automatically to local/Atlas MongoDB when available.
- **Embedded Fallback**: If MongoDB is not installed locally, the backend automatically runs with a persistent, high-performance JSON store in `data/store.json`. **The app works 100% out of the box on any machine!**

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Axios, Modern Indian CSS Theme, SVG Badges.
- **Backend**: Node.js, Express.js, JWT Authentication, Bcrypt.js, CORS.
- **Database**: Dual Architecture (MongoDB via Mongoose ODM + Persistent File Store fallback).
- **Logistics**: Delhivery / Blue Dart tracking simulator with dynamic OTP.

---

## 📦 Getting Started

### 1. Installation

From the project root:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd ecommerce-app
npm install --legacy-peer-deps
cd ..
```

### 2. Start Both Backend & Frontend with One Command

```bash
npm run dev
```

This starts:
- **Backend API**: `http://localhost:5002`
- **Frontend App**: `http://localhost:3000`

### 3. Individual Commands (Optional)

```bash
# Run backend only
npm run server

# Run frontend only
npm run client

# Build frontend for production
npm run build

# Seed MongoDB with Indian products (if MongoDB is running)
npm run seed
```

---

## 🧪 Demo Credentials

You can use the **1-Click Quick Demo Login** buttons on the login page or enter manually:

| Name | Email | Password | Location |
|------|-------|----------|----------|
| **Aarav Sharma** | `aarav@bharatbazaar.in` | `password123` | Mumbai, Maharashtra (400001) |
| **Priya Patel** | `priya@bharatbazaar.in` | `password123` | Bengaluru, Karnataka (560001) |

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Create an account with Indian mobile number and PIN code.
- `POST /api/auth/login` - Login with email and password.
- `POST /api/auth/demo-login` - Instant 1-click demo login.
- `GET /api/auth/profile` - Get logged-in user profile (`Bearer <token>`).

### Products
- `GET /api/products` - Filterable products (`page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `sort`).
- `GET /api/products/:id` - Product details with HSN code, specs, and warranty.
- `GET /api/products/search?q=...` - Product search.
- `GET /api/products/category/:category` - Products by category.

### Cart & Wishlist
- `GET /api/cart` - User cart with price and MRP totals.
- `POST /api/cart` - Add item (`{ productId, quantity }`).
- `PUT /api/cart/:productId` - Update quantity.
- `DELETE /api/cart/:productId` - Remove item.
- `DELETE /api/cart` - Clear cart.
- `GET /api/wishlist` - Get wishlist items.
- `POST /api/wishlist/toggle` - Toggle item in/out of wishlist.

### Orders, Logistics & Tracking
- `POST /api/orders` - Place order with Indian address, payment method, CGST/SGST breakup.
- `GET /api/orders` - Get current user orders.
- `GET /api/orders/:id` - Detailed order view with tracking steps.
- `PUT /api/orders/:id/status` - Update status (for demo tracking simulation).
- `PUT /api/orders/:id/cancel` - Cancel order with refund update.

### Coupons & PIN Code Lookup
- `GET /api/coupons` - List of active festive coupon codes.
- `POST /api/coupons/validate` - Validate code against cart value (`{ code, subtotal }`).
- `GET /api/pincode/:code` - Auto-detect city, state, and delivery speed for any 6-digit Indian PIN code.

---

## 🇮🇳 Made with Pride for India
Designed and developed for Indian consumers and e-commerce enterprises.
