const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const dbStore = require('../data/dbStore');

// Get cart
exports.getCart = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
      if (!cart) {
        cart = await Cart.create({ userId: req.userId, items: [], totalPrice: 0 });
      }
      return res.status(200).json({ cart, items: cart.items, totalPrice: cart.totalPrice });
    } else {
      const cart = dbStore.getCart(req.userId);
      return res.status(200).json({ cart, items: cart.items, totalPrice: cart.totalPrice });
    }
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      let cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        cart = new Cart({
          userId: req.userId,
          items: [{ productId, quantity: Number(quantity), price: product.price }],
          totalPrice: product.price * Number(quantity)
        });
      } else {
        const existing = cart.items.find((item) => item.productId.toString() === productId);
        if (existing) {
          existing.quantity += Number(quantity);
        } else {
          cart.items.push({ productId, quantity: Number(quantity), price: product.price });
        }
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }

      await cart.save();
      await cart.populate('items.productId');
      return res.status(200).json({ message: 'Added to cart', cart, items: cart.items });
    } else {
      const cart = dbStore.addToCart(req.userId, productId, quantity);
      return res.status(200).json({ message: 'Added to cart', cart, items: cart.items });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userId: req.userId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      if (Number(quantity) <= 0) {
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
      } else {
        const item = cart.items.find((i) => i.productId.toString() === productId);
        if (item) item.quantity = Number(quantity);
      }

      cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await cart.save();
      await cart.populate('items.productId');
      return res.status(200).json({ message: 'Cart updated', cart, items: cart.items });
    } else {
      const cart = dbStore.updateCartItem(req.userId, productId, quantity);
      return res.status(200).json({ message: 'Cart updated', cart, items: cart.items });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userId: req.userId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await cart.save();
      await cart.populate('items.productId');
      return res.status(200).json({ message: 'Item removed', cart, items: cart.items });
    } else {
      const cart = dbStore.removeFromCart(req.userId, productId);
      return res.status(200).json({ message: 'Item removed', cart, items: cart.items });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const cart = await Cart.findOneAndUpdate({ userId: req.userId }, { items: [], totalPrice: 0 }, { new: true });
      return res.status(200).json({ message: 'Cart cleared', cart: { items: [], totalPrice: 0 }, items: [] });
    } else {
      const cart = dbStore.clearCart(req.userId);
      return res.status(200).json({ message: 'Cart cleared', cart, items: [] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
