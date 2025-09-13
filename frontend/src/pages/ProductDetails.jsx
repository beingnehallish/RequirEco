// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductDetails.css';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext1';
import ProductCard from '../components/ProductCard';
import { FaStar } from 'react-icons/fa';
import Popup from '../components/Popup';


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addToCart, addToWishlist } = useShop();
  const { user } = useAuth();
  const [popup, setPopup] = useState(null); 
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

// Fetch product details
  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`).then(res => {
      setProduct(res.data);
      fetchRelated(res.data.category);
    });
    fetchReviews();
  }, [id]);

  // Fetch related products
  const fetchRelated = async (category) => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      const filtered = res.data.filter(p => p.category === category && p._id !== id);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error('Error loading related products:', err);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

const showPopup = (msg, icon) => {
  setPopup({ message: msg, icon });

  // Auto-hide after 2 seconds
  setTimeout(() => {
    setPopup(null);
  }, 2000);
};

const StarRating = ({ rating, setRating }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map(star => (
      <FaStar
        key={star}
        className={star <= rating ? 'star filled' : 'star'}
        onClick={() => setRating(star)}
      />
    ))}
  </div>
);
useEffect(() => {
  if (reviews.length > 2) {
    const interval = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
    }, 1000); // ⏱ auto-slide every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }
}, [reviews]);

const prevReview = () => {
  setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
};

const nextReview = () => {
  setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
};
  // Submit review
  const handleReviewSubmit = async () => {
    if (!user) return alert("Login required to submit a review");

    try {
      const res = await axios.post('http://localhost:5000/api/reviews', {
        productId: id,
        userId: user._id,
        rating,
        comment,
      });

      setRating(0);
      setComment('');
      fetchReviews(); // refresh
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (!product) return <p>Loading product...</p>;

  const getRatingDistribution = () => {
  const total = reviews.length;
  const distribution = [0, 0, 0, 0, 0]; // Index 0 = 1 star, 4 = 5 stars

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating - 1]++;
    }
  });

  return distribution.map((count) => ({
    count,
    percent: total > 0 ? ((count / total) * 100).toFixed(1) : 0
  }));
};

const ratingStats = getRatingDistribution();

  return (
    <div className="product-details-container">
      <div className="product-main">
        <img src={product.image} alt={product.name} />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p><strong>₹{product.price}</strong></p><br></br>
          <p>{product.description}</p><br></br>
          <p><strong>Carbon Footprint:</strong> {product.carbonFootprint} kg</p>
          <p><strong>Sustainability:</strong> {product.sustainabilityRating}/5</p>
          <button
  onClick={() => {
    addToCart(product);
    showPopup('Item added to cart! | 商品がカートに追加されました!', '🛒');
  }}
>
  Add to Cart | カートに追加
</button>
<br></br><br></br>
<button
  onClick={() => {
    addToWishlist(product);
    showPopup('Item added to wishlist! | アイテムをウィッシュリストに追加しました!', '💚');
  }}
> 
  Add to Wishlist | ウィッシュリストに追加
</button>
<br></br><br></br>
<iframe
  width="400"
  height="250"
  src={product.video}
  title="YouTube video player" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>


        </div>
      </div>

      <div className="reviews-section">
  <h3>🗣 Customer Reviews</h3><br></br>
  {reviews.length === 0 ? (
    <p>No reviews yet.</p>
  ) : (
    <div className="review-slider">
      <div className="review-slide">
        <p className="quote">"{reviews[currentReviewIndex].comment}"</p>
        <p>⭐ {reviews[currentReviewIndex].rating}/5</p>
      </div>
    </div>
  )}
{reviews.length > 0 && (
  <div className="rating-summary">
    <h4>⭐ Rating Summary</h4>
    {ratingStats.map((stat, index) => (
      <div className="rating-bar" key={index}>
        <span className="star-label">{index + 1} star</span>
        <div className="progress-container">
          <div
            className="progress-fill"
            style={{ width: `${stat.percent}%` }}
          ></div>
        </div>
        <span className="percent-label">{stat.percent}%</span>
      </div>
    ))}
  </div>
)}

  <div className="review-form">
    <h4>Leave a Review</h4>
    <label>Rating:</label>
    <StarRating rating={rating} setRating={setRating} />
    <textarea
      placeholder="Write your comment"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className="review-textarea"
    />
    <button onClick={handleReviewSubmit}>Submit Review</button>
  </div>
</div>


      {/* Related Products */}
      <div className="related-products">
        <h3 >🧩 Products You Might Like</h3>
        <div className="product-grid">
          {relatedProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
      {popup && (
  <Popup
    message={popup.message}
    icon={popup.icon}
    onClose={() => setPopup(null)}
  />
)}

    </div>
    
  );
};

export default ProductDetails;
