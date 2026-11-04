// Active Indian festive and promotional coupon codes
const coupons = [
  {
    code: 'INDIA100',
    flatDiscount: 100,
    minOrderValue: 799,
    description: 'Flat ₹100 instant discount on minimum order of ₹799'
  },
  {
    code: 'FESTIVE15',
    discountPercent: 15,
    maxDiscount: 500,
    minOrderValue: 999,
    description: '15% instant discount up to ₹500 on festive orders above ₹999'
  },
  {
    code: 'FIRSTBUY',
    flatDiscount: 150,
    minOrderValue: 999,
    description: 'Flat ₹150 OFF for new customers on minimum order of ₹999'
  },
  {
    code: 'BHARAT50',
    flatDiscount: 50,
    minOrderValue: 499,
    description: 'Flat ₹50 OFF on all orders above ₹499'
  },
  {
    code: 'FREESHIP',
    freeShipping: true,
    minOrderValue: 0,
    description: '100% Free Express Delivery across India (No minimum order)'
  },
  // Alias for backward compatibility
  {
    code: 'WELCOME100',
    flatDiscount: 100,
    minOrderValue: 799,
    description: 'Flat ₹100 instant discount on minimum order of ₹799'
  }
];

const validateCoupon = (code, subtotal) => {
  if (!code) return { valid: false, message: 'Please enter a coupon code' };
  const cleanCode = code.trim().toUpperCase();
  const coupon = coupons.find((c) => c.code === cleanCode);

  if (!coupon) {
    return { valid: false, message: `Coupon "${cleanCode}" is invalid or expired` };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for ${cleanCode}`
    };
  }

  let discountAmount = 0;
  if (coupon.discountPercent) {
    discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.flatDiscount) {
    discountAmount = coupon.flatDiscount;
  }

  return {
    valid: true,
    coupon,
    discountAmount,
    freeShipping: !!coupon.freeShipping,
    message: `Coupon ${cleanCode} applied successfully! You saved ₹${discountAmount.toLocaleString('en-IN')}`
  };
};

module.exports = { coupons, validateCoupon };
