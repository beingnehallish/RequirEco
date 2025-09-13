import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import '../styles/Auth.css';
import '../styles/Popup.css'; // 👈 Your provided popup styles

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await signup(form);
      if (token) {
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      alert('Signup failed. Try a different email.');
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
        Already have an account?{' '}
        <span className="signup-link" onClick={() => navigate('/login')}>
          Login here
        </span>
      </form>

      {popupVisible && (
        <div className="popup-backdrop">
          <div className="popup-box">
            <div className="popup-icon">✊</div>
            <p>You're all set to go!</p>
          </div>
        </div>
      )}
      <div className="vendor-prompt" onClick={() => navigate('/vendor-signup')}>
  Want to sell? You're at the right place!
</div>

    </>
  );
}

export default Signup;
