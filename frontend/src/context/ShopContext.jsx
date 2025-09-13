// src/context/ShopContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToCart = (product) => {
    const exists = cartItems.find((item) => item._id === product._id);
    if (exists) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const updateCartQuantity = (id, qty) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const addToWishlist = (product) => {
    if (!wishlistItems.find((item) => item._id === product._id)) {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item._id !== id));
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  // ✅ ADD THIS FUNCTION
  const moveToWishlist = (product) => {
    if (!wishlistItems.find((item) => item._id === product._id)) {
      setWishlistItems([...wishlistItems, product]);
    }
    removeFromCart(product._id);
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        moveToWishlist, // ✅ Export it here
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
