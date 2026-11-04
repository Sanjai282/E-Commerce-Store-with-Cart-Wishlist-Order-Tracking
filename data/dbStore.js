const fs = require('fs');
const path = require('path');
const initialProducts = require('./productsData');
const bcrypt = require('bcryptjs');

const STORE_PATH = path.join(__dirname, 'store.json');

// Default initial state
function getDefaultState() {
  const hashedPassword = bcrypt.hashSync('password123', 10);
  return {
    users: [
      {
        id: 'usr-001',
        _id: 'usr-001',
        name: 'Aarav Sharma',
        email: 'aarav@bharatbazaar.in',
        password: hashedPassword,
        phone: '+91 98765 43210',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        addresses: [
          {
            id: 'addr-01',
            fullName: 'Aarav Sharma',
            phone: '9876543210',
            address: 'Flat 402, Sunshine Towers, Marine Drive',
            landmark: 'Opposite Marine Plaza Hotel',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            addressType: 'Home',
            isDefault: true
          },
          {
            id: 'addr-02',
            fullName: 'Aarav Sharma (Office)',
            phone: '9876543210',
            address: 'Floor 12, Express Towers, Nariman Point',
            landmark: 'Near Air India Building',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400021',
            addressType: 'Work',
            isDefault: false
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-002',
        _id: 'usr-002',
        name: 'Priya Patel',
        email: 'priya@bharatbazaar.in',
        password: hashedPassword,
        phone: '+91 98234 56789',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034',
        addresses: [
          {
            id: 'addr-03',
            fullName: 'Priya Patel',
            phone: '9823456789',
            address: 'Villa 18, Green Glen Layout, Bellandur',
            landmark: 'Near EcoSpace Tech Park',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560103',
            addressType: 'Home',
            isDefault: true
          }
        ],
        createdAt: new Date().toISOString()
      }
    ],
    products: initialProducts,
    carts: {
      'usr-001': {
        userId: 'usr-001',
        items: [
          {
            productId: 'prod-001',
            name: 'boAt Rockerz 550 Over-Ear Wireless Headphones',
            price: 1999,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
            category: 'Electronics'
          }
        ],
        totalPrice: 1999
      }
    },
    wishlists: {
      'usr-001': ['prod-002', 'prod-008']
    },
    orders: [
      {
        _id: 'ORD-IN-2026-91823',
        id: 'ORD-IN-2026-91823',
        orderId: 'ORD-IN-2026-91823',
        trackingNumber: 'DEL-8392019482IN',
        courier: 'Delhivery Express',
        deliveryOtp: '4829',
        userId: 'usr-001',
        deliveryAssociate: {
          name: 'Rajesh Kumar',
          phone: '+91 98123 45678',
          vehicle: 'Electric Delivery Van (MH-04-EV-2026)',
          rating: '4.9 ★ (1,840 deliveries)'
        },
        transitRoute: [
          { hub: 'Bhiwandi Super Fulfillment Center, Mumbai', status: 'Completed', time: 'Yesterday, 10:30 AM' },
          { hub: 'Central Sorting Facility, Kurla', status: 'Completed', time: 'Yesterday, 08:45 PM' },
          { hub: 'South Mumbai Delivery Center, Colaba', status: 'In Transit', time: 'Today, 06:15 AM' },
          { hub: 'Out for Doorstep Delivery', status: 'Pending', time: 'Expected by 4:00 PM' }
        ],
        items: [
          {
            productId: 'prod-002',
            productName: 'Noise ColorFit Pulse 2 Max 1.85" Display Smartwatch',
            quantity: 1,
            price: 1499,
            subtotal: 1499,
            hsnCode: '85176290',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
          }
        ],
        subtotal: 1499,
        discount: 100,
        couponCode: 'INDIA100',
        shipping: 0,
        cgst: 125.91,
        sgst: 125.91,
        tax: 251.82,
        totalAmount: 1399,
        status: 'shipped',
        paymentMethod: 'UPI (Google Pay)',
        paymentStatus: 'completed',
        shippingAddress: {
          fullName: 'Aarav Sharma',
          phone: '+91 98765 43210',
          address: 'Flat 402, Sunshine Towers, Marine Drive',
          landmark: 'Opposite Marine Plaza Hotel',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          addressType: 'Home'
        },
        timeline: [
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 36 * 3600000).toISOString(),
            description: 'Order confirmed and payment verified via UPI (Google Pay)'
          },
          {
            status: 'processing',
            timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
            description: 'Order packed at Bhiwandi Super Fulfillment Hub, Mumbai'
          },
          {
            status: 'shipped',
            timestamp: new Date(Date.now() - 10 * 3600000).toISOString(),
            description: 'Dispatched with Delhivery Express (AWB: DEL-8392019482IN)'
          }
        ],
        createdAt: new Date(Date.now() - 36 * 3600000).toISOString()
      }
    ]
  };
}

class DBStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      this.data = getDefaultState();
      this.save();
    } catch (err) {
      console.error('Error initializing store:', err.message);
      this.data = getDefaultState();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist store:', err);
    }
  }

  // Users
  getUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.data.users.find((u) => u.id === id || u._id === id);
  }

  createUser(userData) {
    const id = `usr-${Date.now()}`;
    const user = {
      id,
      _id: id,
      ...userData,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          fullName: userData.name,
          phone: userData.phone || '9876543210',
          address: userData.address || 'Primary Residence',
          city: userData.city || 'Mumbai',
          state: userData.state || 'Maharashtra',
          pincode: userData.pincode || '400001',
          addressType: 'Home',
          isDefault: true
        }
      ],
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    this.save();
    return user;
  }

  getUserAddresses(userId) {
    const user = this.getUserById(userId);
    return user?.addresses || [];
  }

  addUserAddress(userId, addressData) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    if (!user.addresses) user.addresses = [];
    const newAddr = {
      id: `addr-${Date.now()}`,
      ...addressData,
      isDefault: user.addresses.length === 0
    };
    user.addresses.push(newAddr);
    this.save();
    return user.addresses;
  }

  // Products
  getProducts({ page = 1, limit = 12, category, subcategory, search, minPrice, maxPrice, minRating, fastDelivery, sort } = {}) {
    let list = [...this.data.products];

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (subcategory && subcategory !== 'All') {
      list = list.filter((p) => p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      list = list.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }

    if (minRating !== undefined && minRating !== null && minRating !== '') {
      list = list.filter((p) => p.rating >= Number(minRating));
    }

    if (fastDelivery === 'true' || fastDelivery === true) {
      list = list.filter((p) => {
        const speed = p.deliverySpeed || p.deliveryTime || '';
        return speed.includes('⚡') || speed.toLowerCase().includes('tomorrow') || speed.toLowerCase().includes('same-day');
      });
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      totalProducts: total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      currentPage: Number(page)
    };
  }

  getProductById(id) {
    return this.data.products.find((p) => p._id === id || p.id === id);
  }

  // Customer Reviews
  addReview(productId, reviewData) {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');
    if (!product.reviews) product.reviews = [];

    const newReview = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewData.reviewerName || 'Verified Customer',
      city: reviewData.city || 'India',
      rating: Number(reviewData.rating) || 5,
      title: reviewData.title || 'Great product',
      comment: reviewData.comment || 'Verified purchase.',
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    product.reviews.unshift(newReview);
    product.reviewsCount = (product.reviewsCount || 0) + 1;

    // Recalculate average rating
    const sumRatings = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((sumRatings / product.reviews.length).toFixed(1));

    this.save();
    return { product, reviews: product.reviews };
  }

  getReviews(productId) {
    const product = this.getProductById(productId);
    return product?.reviews || [];
  }

  // Cart
  getCart(userId) {
    if (!this.data.carts[userId]) {
      this.data.carts[userId] = { userId, items: [], totalPrice: 0 };
      this.save();
    }
    return this.data.carts[userId];
  }

  addToCart(userId, productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const cart = this.getCart(userId);
    const existing = cart.items.find((item) => (item.productId?._id || item.productId || item.id) === productId);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        category: product.category,
        quantity: Number(quantity)
      });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.save();
    return cart;
  }

  updateCartItem(userId, productId, quantity) {
    const cart = this.getCart(userId);
    const qty = Number(quantity);

    if (qty <= 0) {
      cart.items = cart.items.filter((item) => (item.productId?._id || item.productId || item.id) !== productId);
    } else {
      const item = cart.items.find((i) => (i.productId?._id || i.productId || i.id) === productId);
      if (item) {
        item.quantity = qty;
      }
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.save();
    return cart;
  }

  removeFromCart(userId, productId) {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter((item) => (item.productId?._id || item.productId || item.id) !== productId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.save();
    return cart;
  }

  clearCart(userId) {
    this.data.carts[userId] = { userId, items: [], totalPrice: 0 };
    this.save();
    return this.data.carts[userId];
  }

  // Wishlist
  getWishlist(userId) {
    const productIds = this.data.wishlists[userId] || [];
    return productIds.map((id) => this.getProductById(id)).filter(Boolean);
  }

  toggleWishlist(userId, productId) {
    if (!this.data.wishlists[userId]) {
      this.data.wishlists[userId] = [];
    }
    const list = this.data.wishlists[userId];
    const index = list.indexOf(productId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
      added = false;
    } else {
      list.push(productId);
      added = true;
    }
    this.save();
    return { added, items: this.getWishlist(userId) };
  }

  isInWishlist(userId, productId) {
    const list = this.data.wishlists[userId] || [];
    return list.includes(productId);
  }

  // Orders
  createOrder(userId, orderPayload) {
    const orderId = `ORD-IN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const couriers = ['Delhivery Express', 'Blue Dart Express', 'DTDC Prime', 'Xpressbees Air'];
    const selectedCourier = couriers[Math.floor(Math.random() * couriers.length)];
    const trackingNumber = `DEL-${Math.floor(100000000 + Math.random() * 900000000)}IN`;
    const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));

    const deliveryAssociates = [
      { name: 'Rajesh Kumar', phone: '+91 98123 45678', vehicle: 'Eco Delivery Van (MH-04-EV-2026)', rating: '4.9 ★' },
      { name: 'Suresh Patil', phone: '+91 98234 56789', vehicle: 'Express Two-Wheeler (KA-01-AB-1984)', rating: '4.8 ★' },
      { name: 'Amit Verma', phone: '+91 98345 67890', vehicle: 'Electric Cargo Van (DL-01-EL-4821)', rating: '5.0 ★' }
    ];
    const associate = deliveryAssociates[Math.floor(Math.random() * deliveryAssociates.length)];

    const destinationCity = orderPayload.shippingAddress?.city || 'Delivery Location';

    const newOrder = {
      _id: orderId,
      id: orderId,
      orderId,
      trackingNumber,
      courier: selectedCourier,
      deliveryOtp,
      deliveryAssociate: associate,
      transitRoute: [
        { hub: 'Regional Fulfillment Center, Hub 1', status: 'Completed', time: 'Just now' },
        { hub: `Transit Hub to ${destinationCity}`, status: 'Processing', time: 'In Progress' },
        { hub: `Destination Delivery Station, ${destinationCity}`, status: 'Pending', time: 'Tomorrow morning' },
        { hub: 'Out for Doorstep Delivery', status: 'Pending', time: 'Tomorrow by 4:00 PM' }
      ],
      userId,
      items: orderPayload.items || [],
      subtotal: orderPayload.subtotal || 0,
      discount: orderPayload.discount || 0,
      couponCode: orderPayload.couponCode || null,
      shipping: orderPayload.shipping || 0,
      cgst: orderPayload.cgst || (orderPayload.tax ? orderPayload.tax / 2 : 0),
      sgst: orderPayload.sgst || (orderPayload.tax ? orderPayload.tax / 2 : 0),
      tax: orderPayload.tax || 0,
      totalAmount: orderPayload.total || orderPayload.totalAmount || 0,
      status: 'pending',
      paymentMethod: orderPayload.paymentMethod || 'UPI',
      paymentStatus: orderPayload.paymentMethod?.toLowerCase().includes('cash') ? 'pending' : 'completed',
      shippingAddress: orderPayload.shippingAddress || {},
      timeline: [
        {
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          description: `Order placed successfully. Payment mode: ${orderPayload.paymentMethod || 'UPI'}`
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.data.orders.unshift(newOrder);
    this.clearCart(userId);
    this.save();
    return newOrder;
  }

  getUserOrders(userId) {
    return this.data.orders.filter((o) => o.userId === userId);
  }

  getOrderById(id) {
    return this.data.orders.find((o) => o._id === id || o.id === id || o.orderId === id);
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.status = newStatus;
    const descriptions = {
      processing: `Order is being packed at regional fulfillment center`,
      shipped: `Shipped with ${order.courier} (AWB: ${order.trackingNumber})`,
      out_for_delivery: `Out for delivery with ${order.deliveryAssociate?.name || 'delivery associate'}. Verify with Safe Delivery OTP: ${order.deliveryOtp}`,
      delivered: `Order delivered successfully. Safe delivery OTP verified.`,
      cancelled: `Order was cancelled by customer. Refund credited to original payment source.`
    };

    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      description: descriptions[newStatus] || `Order status updated to ${newStatus}`
    });

    if (newStatus === 'delivered' && order.paymentMethod?.toLowerCase().includes('cash')) {
      order.paymentStatus = 'completed';
    }

    this.save();
    return order;
  }

  cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, 'cancelled');
  }
}

const dbStore = new DBStore();
module.exports = dbStore;
