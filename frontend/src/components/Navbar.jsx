import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext1';
import '../styles/Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <h1>RecquirEco</h1>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Home | ホームページ</NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Cart | カート</NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Wishlist | ウィッシュリスト</NavLink>
        <NavLink to="/location" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Locate us | 場所</NavLink>
        {user ? (
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Dashboard | ダッシュボード</NavLink>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Login | ログイン</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
