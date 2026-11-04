const express = require('express');
const router = express.Router();
const { lookupPincode, pincodes } = require('../data/pincodesData');

// Check/lookup PIN code - Smart Indian Logistics Hub Estimator
router.get('/:code', (req, res) => {
  const { code } = req.params;
  const result = lookupPincode(code);

  if (!result) {
    return res.status(400).json({
      valid: false,
      message: 'Please enter a valid 6-digit Indian PIN code'
    });
  }

  res.status(200).json({
    valid: true,
    pincode: code,
    ...result
  });
});

module.exports = router;
