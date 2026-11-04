const express = require('express');
const router = express.Router();
const { coupons, validateCoupon } = require('../data/couponsData');

// Get all active coupon codes
router.get('/', (req, res) => {
  res.status(200).json({ coupons });
});

// Validate coupon code
router.post('/validate', (req, res) => {
  const { code, subtotal = 0 } = req.body;
  const result = validateCoupon(code, Number(subtotal));

  if (!result.valid) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
});

module.exports = router;
