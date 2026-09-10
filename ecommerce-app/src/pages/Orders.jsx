// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data.orders || []);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await ordersAPI.cancelOrder(orderId);
      fetchOrders();
      alert('Order cancelled successfully');
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  if (!user) {
    return (
      <div className="orders-page empty-state">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your orders</p>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="orders-page loading">Loading your orders...</div>;
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page empty-state">
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id || order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{(order._id || order.id).substring(0, 8).toUpperCase()}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt || order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
                <div className="order-total">
                  <span className="total-amount">
                    ₹{(order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="order-body">
                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">Items:</span>
                    <span className="detail-value">
                      {order.items?.length || 0} product(s)
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Subtotal:</span>
                    <span className="detail-value">
                      ₹{(order.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tax:</span>
                    <span className="detail-value">
                      ₹{(order.tax || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Shipping:</span>
                    <span className="detail-value">
                      {order.shipping === 0 ? (
                        <span className="free">FREE</span>
                      ) : (
                        `₹${(order.shipping || 0).toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-expand"
                  onClick={() =>
                    setExpandedOrder(expandedOrder === (order._id || order.id) ? null : (order._id || order.id))
                  }
                >
                  {expandedOrder === (order._id || order.id) ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedOrder === (order._id || order.id) && (
                <div className="order-expanded">
                  <div className="items-list">
                    <h4>Items:</h4>
                    {order.items?.map((item, index) => (
                      <div key={index} className="item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x {item.quantity}</span>
                        <span className="item-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="shipping-address">
                    <h4>Shipping Address:</h4>
                    <p>
                      {order.shippingAddress?.address}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                      {order.shippingAddress?.zipCode}<br />
                      {order.shippingAddress?.phone}
                    </p>
                  </div>

                  <div className="order-actions">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id || order.id)}
                        className="btn btn-danger"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;