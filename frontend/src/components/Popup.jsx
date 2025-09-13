// components/Popup.jsx
import React, { useEffect } from 'react';
import '../styles/Popup.css';

const Popup = ({ message, icon, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup-backdrop">
      <div className="popup-box">
        <div className="popup-icon">{icon}</div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
