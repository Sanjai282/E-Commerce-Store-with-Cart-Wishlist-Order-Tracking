// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [deliveryPincode, setDeliveryPincode] = useState(() => {
    return localStorage.getItem('deliveryPincode') || '400001';
  });
  const [deliveryCity, setDeliveryCity] = useState(() => {
    return localStorage.getItem('deliveryCity') || 'Mumbai';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.pincode) setDeliveryPincode(parsed.pincode);
        if (parsed.city) setDeliveryCity(parsed.city);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const updateLocation = (pincode, city) => {
    setDeliveryPincode(pincode);
    setDeliveryCity(city);
    localStorage.setItem('deliveryPincode', pincode);
    localStorage.setItem('deliveryCity', city);
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      if (newUser.pincode && newUser.city) {
        updateLocation(newUser.pincode, newUser.city);
      }

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { token, user: loggedUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      if (loggedUser.pincode && loggedUser.city) {
        updateLocation(loggedUser.pincode, loggedUser.city);
      }

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  };

  const demoLogin = async (email = 'aarav@bharatbazaar.in') => {
    try {
      setError(null);
      const response = await authAPI.demoLogin(email);
      const { token, user: loggedUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      if (loggedUser.pincode && loggedUser.city) {
        updateLocation(loggedUser.pincode, loggedUser.city);
      }

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Demo login failed';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        deliveryPincode,
        deliveryCity,
        updateLocation,
        loading,
        error,
        register,
        login,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
