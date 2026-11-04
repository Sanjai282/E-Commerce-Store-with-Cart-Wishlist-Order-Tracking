const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    mrp: {
      type: Number
    },
    discount: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true
    },
    subcategory: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      default: 100
    },
    rating: {
      type: Number,
      default: 4.5
    },
    reviewsCount: {
      type: Number,
      default: 120
    },
    badge: {
      type: String
    },
    hsnCode: {
      type: String,
      default: '85183000'
    },
    gstRate: {
      type: Number,
      default: 18
    },
    brand: String,
    origin: {
      type: String,
      default: 'Made in India'
    },
    warranty: String,
    specifications: {
      type: Map,
      of: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
