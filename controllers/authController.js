const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const dbStore = require('../data/dbStore');

const JWT_SECRET = process.env.JWT_SECRET || 'bharat_bazaar_secret_key_2026';

const createToken = (id, email) => {
  return jwt.sign({ id, email }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, city, state, pincode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone: phone || '+91 98765 43210',
        city,
        state,
        pincode
      });

      const token = createToken(user._id, user.email);

      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          state: user.state,
          pincode: user.pincode
        }
      });
    } else {
      // Use resilient file store
      const existing = dbStore.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = dbStore.createUser({
        name,
        email,
        password: hashedPassword,
        phone: phone || '+91 98765 43210',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        pincode: pincode || '400001'
      });

      const token = createToken(user.id, user.email);
      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          state: user.state,
          pincode: user.pincode
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = createToken(user._id, user.email);

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          state: user.state,
          pincode: user.pincode
        }
      });
    } else {
      const user = dbStore.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = createToken(user.id, user.email);
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          state: user.state,
          pincode: user.pincode
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ user });
    } else {
      const user = dbStore.getUserById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      return res.status(200).json({ user: safeUser });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 1-Click Demo Login (Aarav Sharma or Priya Patel)
exports.demoLogin = async (req, res) => {
  try {
    const demoEmail = req.body.email || 'aarav@bharatbazaar.in';
    const user = dbStore.getUserByEmail(demoEmail);

    if (!user) {
      return res.status(404).json({ message: 'Demo account not found' });
    }

    const token = createToken(user.id, user.email);
    const { password, ...safeUser } = user;

    res.status(200).json({
      message: 'Logged in as Demo User',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = dbStore.getUserAddresses(req.userId);
    return res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const addresses = dbStore.addUserAddress(req.userId, req.body);
    return res.status(201).json({ message: 'Address saved successfully', addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
