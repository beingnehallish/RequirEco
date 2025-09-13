// src/pages/VendorLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 import "../styles/Vendor.css";

const VendorLogin = () => {
  const [credentials, setCredentials] = useState({ personalEmail: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/vendors/login", credentials);

    if (res.data.success) {
      alert("Login successful!");

      // Save vendorId safely
      if (res.data.vendorId) {
        localStorage.setItem("vendorId", res.data.vendorId);
      } else {
        console.error("No vendorId returned from login!");
        return;
      }

      navigate("/vendor-dashboard");
    }
  } catch (err) {
    console.error(err);
    alert("Invalid credentials.");
  }
};

  return (
    <div className="vendor-form-container">
      <h2>VENDOR LOGIN</h2>
      <h2>ベンダーログイン</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="personalEmail" placeholder="Personal Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login | ログイン</button>
      </form>
    </div>
  );
};

export default VendorLogin;
