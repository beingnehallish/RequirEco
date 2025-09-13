// src/components/ProductCard.jsx
import React from 'react';
import '../styles/ProductCard.css';

function ProductCard({ product, onAddToCart, onAddToWishlist, isWishlisted }) {
  const handleWishlist = () => {
    if (!isWishlisted) {
      onAddToWishlist(product);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}</p>
        <p className="carbon">Carbon Footprint : {product.carbonFootprint}</p>
        <p className="impact">Sustainability Rating : {product.sustainabilityRating}</p>
      </div>

      <div className="product-actions">
        <button onClick={(e) => onAddToCart(product, e)}>Add to Cart | カートに追加</button>
<button onClick={(e) => onAddToWishlist(product, e)}>Add to Wishlist | ウィッシュリストに追加</button>

      </div>
    </div>
  );
}

export default ProductCard;
