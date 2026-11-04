const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    orderId: {
      type: String,
      unique: true
    },
    trackingNumber: String,
    courier: {
      type: String,
      default: 'Delhivery Express'
    },
    deliveryOtp: String,
    items: [
      {
        productId: mongoose.Schema.Types.Mixed,
        productName: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
        hsnCode: String,
        image: String
      }
    ],
    subtotal: Number,
    discount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    shipping: {
      type: Number,
      default: 0
    },
    cgst: Number,
    sgst: Number,
    tax: Number,
    totalAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
      addressType: {
        type: String,
        default: 'Home'
      }
    },
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    timeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now
        },
        description: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
