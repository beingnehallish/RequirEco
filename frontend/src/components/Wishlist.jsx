// src/pages/Wishlist.jsx
import React from 'react';
import { Link } from "react-router-dom";
import '../styles/Wishlist.css';
import { useShop } from '../context/ShopContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useShop();

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <>
    <h3>Your wishlist is empty. <br></br><br></br>
    <Link to="/" className="browse-link">
🛍️       Browse our products!
    </Link></h3>
  </>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-card">
              <img src={item.image} alt={item.name} />
              <div className="wishlist-info">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
                <div className="wishlist-actions">
                  <button onClick={() => moveToCart(item)}>Move to Cart</button>
                  <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
