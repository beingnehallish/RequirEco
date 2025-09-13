// Cart.jsx 
import React, { useState } from 'react';
import '../styles/Cart.css';
import { Link } from "react-router-dom";

import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext1';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, moveToWishlist } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const impactDiscount = subtotal * 0.05;
  const total = subtotal - impactDiscount;

  const totalCarbonSaved = cartItems.reduce((acc, item) => {
    const saved = (item.sustainabilityRating || 1) * (item.carbonFootprint || 1) * item.quantity * 0.1; // Example formula
    return acc + saved;
  }, 0);

  const handleCheckout = () => {
    if (user) {
      navigate('/payment');
    } else {
      setShowModal(true);
    }
  };

  const handleMoveToWishlist = (item) => {
    moveToWishlist(item);
    removeFromCart(item._id);
  };

  const handleProductClick = (item) => {
    setSelectedProduct(item);
  };

  const handleBackToCart = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return (
      <div className="cart-container">
        <button className="back-btn" onClick={handleBackToCart}>← Back to Cart</button>
        <div className="product-details-view">
          <img src={selectedProduct.image} alt={selectedProduct.name} className="product-detail-img" />
          <h2>{selectedProduct.name}</h2>
          <p>Price: ₹{selectedProduct.price}</p>
          <p>Carbon Footprint: {selectedProduct.carbonFootprint} kg CO₂</p>
          <p>Sustainability Rating: {selectedProduct.sustainabilityRating}/5</p>
          <p>Quantity: {selectedProduct.quantity}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
         <>
    <h3>Your wishlist is empty. <br></br><br></br>
    <Link to="/" className="browse-link">
🛍️       Browse our products!
    </Link></h3>
  </>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item | アイテム</th>
                <th>Qty | 量</th>
                <th>Price | 価格</th>
                <th>CO₂ Saved | CO2を節約</th>
                <th>Actions | アクション</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td onClick={() => handleProductClick(item)} style={{ cursor: 'pointer' }}>
                    <img src={item.image} alt={item.name} style={{ width: '60px', borderRadius: '6px' }} />
                    <br />{item.name}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item._id, Number(e.target.value))}
                    />
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    {((item.sustainabilityRating || 1) * (item.carbonFootprint || 1) * item.quantity * 0.1).toFixed(2)} kg
                  </td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>🗑️ | 取り除く</button>
                    <button className="move-btn" onClick={() => moveToWishlist(item)}>
   Move to Wishlist | ウィッシュリストに移動
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Impact Discount: ₹{impactDiscount.toFixed(2)}</p>
            <p className="co2">CO₂ Saved: {totalCarbonSaved.toFixed(2)} kg</p>
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="checkout-modal">
          <div className="checkout-box">
            <h3>You're not logged in</h3>
            <p>Please login or sign up to continue</p>
            <div className="modal-actions">
              <button onClick={() => navigate('/signup')}>First Time User?</button>
              <button onClick={() => navigate('/login')}>Need to Log In?</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
