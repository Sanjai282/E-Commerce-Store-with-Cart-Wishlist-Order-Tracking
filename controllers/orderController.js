const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const dbStore = require('../data/dbStore');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = 'UPI (Google Pay)',
      items = [],
      subtotal = 0,
      discount = 0,
      couponCode = null,
      shipping = 0,
      tax = 0,
      total = 0
    } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode) {
      return res.status(400).json({ message: 'Shipping address with full name and pincode is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const orderId = `ORD-IN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const couriers = ['Delhivery Express', 'Blue Dart Express', 'DTDC Prime', 'Xpressbees Air'];
      const courier = couriers[Math.floor(Math.random() * couriers.length)];
      const trackingNumber = `DEL-${Math.floor(100000000 + Math.random() * 900000000)}IN`;
      const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));

      const orderItems = items.map((item) => ({
        productId: item.productId?._id || item.productId || item.id,
        productName: item.name || item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
        hsnCode: item.hsnCode || '85183000',
        image: item.image
      }));

      const calculatedSubtotal = subtotal || orderItems.reduce((sum, i) => sum + i.subtotal, 0);
      const calculatedTax = tax || Math.round(calculatedSubtotal * 0.18);
      const calculatedTotal = total || Math.max(0, calculatedSubtotal + calculatedTax + shipping - discount);

      const order = new Order({
        userId: req.userId,
        orderId,
        trackingNumber,
        courier,
        deliveryOtp,
        items: orderItems,
        subtotal: calculatedSubtotal,
        discount,
        couponCode,
        shipping,
        cgst: calculatedTax / 2,
        sgst: calculatedTax / 2,
        tax: calculatedTax,
        totalAmount: calculatedTotal,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod.toLowerCase().includes('cash') ? 'pending' : 'completed',
        timeline: [
          {
            status: 'confirmed',
            timestamp: new Date(),
            description: `Order placed successfully. Payment mode: ${paymentMethod}`
          }
        ]
      });

      await order.save();

      // Clear user's cart
      await Cart.findOneAndUpdate({ userId: req.userId }, { items: [], totalPrice: 0 });

      return res.status(201).json({ message: 'Order placed successfully', order });
    } else {
      const order = dbStore.createOrder(req.userId, {
        items,
        subtotal,
        discount,
        couponCode,
        shipping,
        tax,
        total,
        shippingAddress,
        paymentMethod
      });
      return res.status(201).json({ message: 'Order placed successfully', order });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
      return res.status(200).json({ orders });
    } else {
      const orders = dbStore.getUserOrders(req.userId);
      return res.status(200).json({ orders });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { orderId: id }]
      });

      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json({ order });
    } else {
      const order = dbStore.getOrderById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json({ order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (for demo and tracking progression)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { orderId: id }]
      });

      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.status = status;
      const descriptions = {
        processing: `Order packed at regional logistics hub`,
        shipped: `Shipped with ${order.courier} (AWB: ${order.trackingNumber})`,
        out_for_delivery: `Out for delivery. Safe delivery OTP: ${order.deliveryOtp}`,
        delivered: `Order delivered. Safe OTP verified.`,
        cancelled: `Order cancelled. Refund initiated.`
      };

      order.timeline.push({
        status,
        timestamp: new Date(),
        description: descriptions[status] || `Order marked as ${status}`
      });

      if (status === 'delivered' && order.paymentMethod?.toLowerCase().includes('cash')) {
        order.paymentStatus = 'completed';
      }

      await order.save();
      return res.status(200).json({ message: 'Order status updated', order });
    } else {
      const order = dbStore.updateOrderStatus(id, status);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json({ message: 'Order status updated', order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { orderId: id }]
      });

      if (!order) return res.status(404).json({ message: 'Order not found' });
      if (['delivered', 'cancelled'].includes(order.status)) {
        return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` });
      }

      order.status = 'cancelled';
      order.timeline.push({
        status: 'cancelled',
        timestamp: new Date(),
        description: 'Order cancelled by customer. Refund credited to original payment source.'
      });

      await order.save();
      return res.status(200).json({ message: 'Order cancelled successfully', order });
    } else {
      const order = dbStore.cancelOrder(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json({ message: 'Order cancelled successfully', order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
