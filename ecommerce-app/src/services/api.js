import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  demoLogin: (email) => api.post('/auth/demo-login', { email }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getProfile: () => api.get('/auth/profile'),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (addressData) => api.post('/auth/addresses', addressData),
};

export const productsAPI = {
  getAll: (page = 1, limit = 12, params = {}) => {
    const query = new URLSearchParams({ page, limit, ...params }).toString();
    return api.get(`/products?${query}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
  getByCategory: (category) => api.get(`/products/category/${encodeURIComponent(category)}`),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
  addReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  updateCart: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  toggleWishlist: (productId) => api.post('/wishlist/toggle', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
};

export const ordersAPI = {
  getMyOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const couponsAPI = {
  getAll: () => api.get('/coupons'),
  validate: (code, subtotal) => api.post('/coupons/validate', { code, subtotal }),
};

export const pincodeAPI = {
  lookup: (code) => api.get(`/pincode/${code}`),
};

export const chatAPI = {
  sendMessage: (message, history = []) => api.post('/chat', { message, history }),
};

export default api;
