const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const dbStore = require('../data/dbStore');

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let wishlist = await Wishlist.findOne({ userId: req.userId }).populate('products');
      if (!wishlist) {
        return res.status(200).json({ items: [] });
      }
      return res.status(200).json({ items: wishlist.products || [] });
    } else {
      const items = dbStore.getWishlist(req.userId);
      return res.status(200).json({ items });
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      let wishlist = await Wishlist.findOne({ userId: req.userId });
      if (!wishlist) {
        wishlist = new Wishlist({ userId: req.userId, products: [productId] });
      } else if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
      await wishlist.save();
      await wishlist.populate('products');
      return res.status(200).json({ items: wishlist.products });
    } else {
      const result = dbStore.toggleWishlist(req.userId, productId);
      return res.status(200).json({ items: result.items });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (mongoose.connection.readyState === 1) {
      let wishlist = await Wishlist.findOne({ userId: req.userId });
      if (!wishlist) return res.status(200).json({ items: [] });

      wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
      await wishlist.save();
      await wishlist.populate('products');
      return res.status(200).json({ items: wishlist.products });
    } else {
      const result = dbStore.toggleWishlist(req.userId, productId);
      return res.status(200).json({ items: result.items });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });

    if (mongoose.connection.readyState === 1) {
      let wishlist = await Wishlist.findOne({ userId: req.userId });
      if (!wishlist) {
        wishlist = new Wishlist({ userId: req.userId, products: [productId] });
        await wishlist.save();
        await wishlist.populate('products');
        return res.status(200).json({ inWishlist: true, items: wishlist.products });
      }

      const strId = productId.toString();
      const index = wishlist.products.findIndex((p) => (p._id || p).toString() === strId);

      let inWishlist = false;
      if (index > -1) {
        wishlist.products.splice(index, 1);
        inWishlist = false;
      } else {
        wishlist.products.push(productId);
        inWishlist = true;
      }

      await wishlist.save();
      await wishlist.populate('products');
      return res.status(200).json({ inWishlist, items: wishlist.products });
    } else {
      const result = dbStore.toggleWishlist(req.userId, productId);
      return res.status(200).json({ inWishlist: result.added, items: result.items });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Is in wishlist check
exports.isInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const wishlist = await Wishlist.findOne({ userId: req.userId });
      if (!wishlist) return res.status(200).json({ inWishlist: false });
      const inWishlist = wishlist.products.some((id) => id.toString() === productId);
      return res.status(200).json({ inWishlist });
    } else {
      const inWishlist = dbStore.isInWishlist(req.userId, productId);
      return res.status(200).json({ inWishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
