const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const protect = require('../middleware/auth');

router.use(protect);

const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId }).populate('products');
  return { items: wishlist?.products || [] };
};

router.get('/', async (req, res) => {
  try {
    res.json(await getWishlist(req.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let wishlist = await Wishlist.findOne({ userId: req.userId });
    if (!wishlist) wishlist = new Wishlist({ userId: req.userId, products: [] });
    if (!wishlist.products.some((id) => id.toString() === productId)) wishlist.products.push(productId);
    await wishlist.save();
    res.json(await getWishlist(req.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { products: req.params.id } },
      { new: true }
    ).populate('products');
    res.json({ items: wishlist?.products || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;