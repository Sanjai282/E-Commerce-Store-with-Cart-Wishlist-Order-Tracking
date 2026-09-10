// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.items || response.data.cart?.items || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await cartAPI.addToCart(productId, quantity);
      setCart(response.data.items || response.data.cart?.items || []);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      setError(message);
      throw err;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setError(null);
      const response = await cartAPI.updateCart(productId, quantity);
      setCart(response.data.items || []);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update cart';
      setError(message);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data.items || []);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove item';
      setError(message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartAPI.clearCart();
      setCart([]);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      setError(message);
      throw err;
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};