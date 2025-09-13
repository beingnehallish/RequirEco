import React, { useEffect, useState } from 'react';
import '../styles/ViewOrders.css';
import { getOrders } from '../services/orderService';

function ViewOrders() {
  const [orders, setOrders] = useState([]);
useEffect(() => {
  if (user?._id) {
    getOrdersByUser(user._id)
      .then(setOrders)
      .catch((err) => console.error('Error fetching orders', err));
  }
}, [user]);

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.map(order => (
        <div className="order-card" key={order._id}>
          <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Carbon Saved:</strong> {order.carbonSaved} kg CO₂</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default ViewOrders;