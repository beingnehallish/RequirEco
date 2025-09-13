import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext1';
import '../styles/Auth.css';
import '../styles/Popup.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data && res.data.user) {
        login(res.data.user);
        setPopupVisible(true);
        setTimeout(() => {
          navigate('/');
        }, 2000); // Delay to show popup
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
        <p>
          <br />
          First Time User?{' '}
          <span className="signup-link" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </form>

      {popupVisible && (
        <div className="popup-backdrop">
          <div className="popup-box">
            <div className="popup-icon">✨</div>
            <p>You're logged in!</p>
          </div>
        </div>
      )}
        <div className="vendor-prompt" onClick={() => navigate('/vendor-login')}>
  Are you a registered vendor? Login here!
</div>
    </div>
    
  );


};

export default Login;
