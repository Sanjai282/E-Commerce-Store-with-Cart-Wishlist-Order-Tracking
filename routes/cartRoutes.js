const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getCart);
router.post('/', addToCart);
router.post('/add', addToCart); // legacy alias
router.put('/:productId', updateQuantity);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
