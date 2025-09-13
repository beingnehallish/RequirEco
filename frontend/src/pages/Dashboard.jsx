// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext1';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { getOrders } from '../services/orderService';
import { getUserById } from '../services/userService';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';

const customIcon = new L.Icon({
  iconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ lat, lng, onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          onLocationChange(e.target.getLatLng());
        },
      }}
    />
  );
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [orders, setOrders] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [geoLocation, setGeoLocation] = useState({ lat: 0, lng: 0 });
  const [impact, setImpact] = useState({ impactPoints: 0, moneySaved: 0 });

  // Fetch user info
  useEffect(() => {
    if (!user || !user._id) return;

    getUserById(user._id)
      .then((res) => {
        const fetchedUser = res.data;
        setAddresses(fetchedUser.addresses || []);
        setPhone(fetchedUser.phone || '');
      })
      .catch(console.error);

    getOrders(user._id)
      .then((res) => {
        const ordersData = Array.isArray(res.data) ? res.data : res.data.orders || [];
        setOrders(ordersData);
      })
      .catch(console.error);

    axios
      .get(`http://localhost:5000/api/users/${user._id}/impact`)
      .then((res) => setImpact(res.data))
      .catch(console.error);
  }, [user]);

  // Address handlers
  const handleDeleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setNewAddress('');

    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        addresses: updated,
        phone,
      });
    } catch (err) {
      console.error('Failed to update addresses:', err);
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setShowMap(true);
      },
      () => alert('Location access denied')
    );
  };

  const saveGeoAddress = () => {
    const address = `Lat: ${geoLocation.lat.toFixed(5)}, Lon: ${geoLocation.lng.toFixed(5)}`;
    setAddresses([...addresses, address]);
    setShowMap(false);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name || 'User'} 👋</h2><br></br>
        <h2>CUSTOMER DASHBOARD | 顧客ダッシュボード 🌱</h2>
        
      {/* Welcome & Impact Points */}
      <div className="neo-card welcome-card">
        <div className="impact-points">
          <div className="neo-card impact-card">
            <h4>Money Saved | 利益</h4>
            <h1>₹{impact.moneySaved.toFixed(2)}</h1>
          </div>
          {/*<div className="neo-card impact-card">
             <h4>Impact Points</h4>
            <p>{impact.impactPoints}</p>
          </div>*/}
        </div>
      </div>

      {/* Profile Section */}
      <div className="neo-card profile-section">
        <h3>📇 Profile Info | プロフィール情報</h3>
        <div className="profile-field">
          <span>Name | 名前:</span> {user?.name}
        </div>
        <div className="profile-field">
          <span>Email | 電子メール:</span> {user?.email}
        </div>
        <div className="profile-field">
          <span>Phone | 電話番号:</span>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Addresses Section */}
      <div className="neo-card address-section">
        <h3>📍 Saved Addresses | 保存されたアドレス</h3>
        <ul className="address-list">
          {addresses.map((addr, idx) => (
            <li key={idx} className="neo-card address-card">
              {addr}
              <button onClick={() => handleDeleteAddress(idx)}>🗑️</button>
            </li>
          ))}
        </ul>
        <div className="address-inputs">
          <input
            type="text"
            placeholder="New Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button onClick={handleAddAddress}>Add | アドレスを追加 </button>
          <button onClick={handleUseCurrentLocation}>Use Maps | 地図を使う</button>
        </div>
        {showMap && (
          <div className="map-container">
            <MapContainer
              center={[geoLocation.lat, geoLocation.lng]}
              zoom={13}
              style={{ height: '300px', borderRadius: '10px' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationSelector lat={geoLocation.lat} lng={geoLocation.lng} onLocationChange={setGeoLocation} />
            </MapContainer>
            <button onClick={saveGeoAddress}>Save Location</button>
          </div>
        )}
      </div>

     {/* Orders Section */}
<div className="neo-card orders-section">
  <h3>📦 Past Orders | 過去の注文</h3>
  {orders.length === 0 ? (
    <p>No past orders yet.</p>
  ) : (
    <div className="orders-list">
      {orders.map((order, idx) => (
        <div key={idx} className="neo-card order-card">
          <div className="order-header">
            <h4>🧾 Order #{order._id.slice(-5)}</h4>
            
          </div>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          {order.carbonSaved && (
            <p><strong>Carbon Saved:</strong> {(order.carbonSaved / 100).toFixed(2)} kg</p>
          )}

          <div className="order-products">
            {order.products.map((p, i) => {
              const product = p.productId;
              return (
                <div key={i} className="neo-card product-summary">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <p><strong>{product.name}</strong></p>
                    <p>Qty: {p.quantity}</p>
                    <p>₹{product.price} each</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      <button
        className="logout-btn neo-card"
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
         Logout | ログアウト
      </button>
    </div>
  );
};

export default Dashboard;
