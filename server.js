require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware - BharatBazaar 2026 Catalog Sync
app.use(cors());
app.use(express.json());

// JWT Secret
process.env.JWT_SECRET = process.env.JWT_SECRET || 'bharat_bazaar_secret_key_2026';

// MongoDB Connection with non-blocking graceful fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2000
  })
  .then(() => {
    console.log(' MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('ℹ MongoDB not reachable locally (' + err.message + ').');
    console.log('⚡ Running smoothly with the built-in persistent Indian database engine (data/store.json).');
  });

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/ProductRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const pincodeRoutes = require('./routes/pincodeRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'BharatBazaar Indian E-Commerce',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString()
  });
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(` BharatBazaar Backend API running on port ${PORT}`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
});

// Export app for testing if needed
module.exports = app;
