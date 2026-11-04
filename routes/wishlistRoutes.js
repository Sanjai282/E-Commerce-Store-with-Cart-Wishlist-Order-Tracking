const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  isInWishlist
} = require('../controllers/wishlistController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/add', addToWishlist); // legacy alias
router.post('/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);
router.delete('/remove/:productId', removeFromWishlist); // legacy alias
router.get('/check/:productId', isInWishlist);

module.exports = router;
