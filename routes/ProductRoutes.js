const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  getByCategory,
  searchProducts,
  getProductReviews,
  addProductReview
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getByCategory);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', addProductReview);
router.post('/', createProduct);

module.exports = router;
