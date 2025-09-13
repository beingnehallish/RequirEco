// src/pages/Payment.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext1';

const Payment = () => {
  const { cartItems } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const loadRazorpay = async () => {
      const options = {
        key: 'rzp_test_vZmuoJceMNndnf', // 🔁 Replace with your Razorpay test key
        amount: totalAmount * 100, // amount in paise
        currency: 'INR',
        name: 'Eco Cart',
        description: 'Eco-friendly product purchase',
        handler: function (response) {
          alert('Payment Successful 🎉');
          console.log('Razorpay Response:', response);

          // Save orders to localStorage
          localStorage.setItem('orders', JSON.stringify(cartItems));

          // Clear cart
          localStorage.removeItem('cartItems');
          navigate('/dashboard');
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#4CAF50',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    if (totalAmount > 0) {
      loadRazorpay();
    } else {
      alert('Cart is empty!');
      navigate('/cart');
    }
  }, [totalAmount, cartItems, user, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Redirecting to Payment...</h2>
    </div>
  );
};

export default Payment;
