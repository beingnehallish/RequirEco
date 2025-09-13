import React from 'react';

const OrderList = ({ orders }) => {
  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map(order => (
        <div key={order._id} className="order-item">
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Carbon Saved:</strong> {order.carbonSaved} kg CO₂</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;