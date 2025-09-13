// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext1';
ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <AuthProvider>
      <ShopProvider>
        <App />
      </ShopProvider>
    </AuthProvider>
  </React.StrictMode>
);
