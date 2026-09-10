const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const protect = require('../middleware/auth');

router.use(protect);

const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) return { items: [], totalPrice: 0 };
  return {
    ...cart.toObject(),
    items: cart.items.map((item) => ({
      ...item.productId.toObject(),
      quantity: item.quantity,
      price: item.price,
    })),
  };
};

router.get('/', async (req, res) => {
  try {
    res.json(await getCart(req.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) cart = new Cart({ userId: req.userId, items: [] });
    const item = cart.items.find((entry) => entry.productId.toString() === productId);
    if (item) item.quantity += Number(quantity);
    else cart.items.push({ productId, quantity: Number(quantity), price: product.price });
    cart.totalPrice = cart.items.reduce((total, entry) => total + entry.price * entry.quantity, 0);
    await cart.save();
    res.json(await getCart(req.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:productId', async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find((entry) => entry.productId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, entry) => total + entry.price * entry.quantity, 0);
    await cart.save();
    res.json(await getCart(req.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();
    res.json(await getCart(req.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    res.json({ items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;