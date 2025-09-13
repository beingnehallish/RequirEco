// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import ProductDetails from './pages/ProductDetails';
import ViewOrders from './pages/ViewOrders';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import VendorLogin from './pages/VendorLogin';
import VendorSignup from './pages/VendorSignup';
import VendorDashboard from './pages/VendorDashboard';
import VendorLayout from './layouts/VendorLayout';
import LogoutButton from './components/LogoutButton';
import Location from './pages/Location';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <Signup />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />
        <Route
          path="/wishlist"
          element={
            <>
              <Navbar />
              <Wishlist />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductDetails />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <ViewOrders />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/location"
          element={
            <>
              <Navbar />
              <Location />
            </>
          }
        />
        <Route
          path="/payment"
          element={
            <>
              <Navbar />
              <Payment />
            </>
          }
        />

        {/* Vendor routes (NO Navbar) */}
        <Route path="/vendor-signup" element={<VendorSignup />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route
          path="/vendor-dashboard"
          element={
            <VendorLayout>
              <VendorDashboard />
            </VendorLayout>
          }
        />
        <Route path="/" element={<LogoutButton />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
