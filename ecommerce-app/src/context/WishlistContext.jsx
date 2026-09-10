// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.items || response.data.wishlist?.products || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setError(null);
      const response = await wishlistAPI.addToWishlist(productId);
      setWishlist(response.data.items || response.data.wishlist?.products || []);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to wishlist';
      setError(message);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setError(null);
      const response = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(response.data.items || []);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove from wishlist';
      setError(message);
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId || item.id === productId);
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};