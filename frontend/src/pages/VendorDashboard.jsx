import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import "../styles/VendorDashboard.css";
import LogoutButton from "../components/LogoutButton";
import { Chart } from "chart.js/auto";

const VendorDashboard = () => {
  const [activeSection, setActiveSection] = useState("store");
  const [vendor, setVendor] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const chartRef = useRef(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    carbonFootprint: "",
    sustainabilityRating: "",
    category: "",
    video: "",
    pieces: 1,
  });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
const rawVendorId = localStorage.getItem("vendorId");

// Guard against missing or invalid vendorId
const vendorId = rawVendorId && rawVendorId !== "null" ? rawVendorId : null;

if (!vendorId) {
  console.error("Invalid vendorId in localStorage. Redirecting to login...");
  window.location.href = "/vendor-login"; // Redirect to login
}

console.log("Vendor ID from localStorage:", vendorId);


useEffect(() => {
  if (activeSection !== "analytics") return; // only create chart when analytics is visible
  if (!chartRef.current || !orders.length) return;

  // Count how many times each product was ordered
  const productCountMap = {};
  orders.forEach(order => {
    order.products.forEach(p => {
      const name = p.productId?.name || "Unknown";
      productCountMap[name] = (productCountMap[name] || 0) + p.quantity;
    });
  });

  const labels = Object.keys(productCountMap);
  const data = Object.values(productCountMap);

  const ctx = chartRef.current.getContext("2d");

  const chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Product Orders (Quantity)",
          data,
          backgroundColor: "#4CAF50",
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    },
  });

  return () => chartInstance.destroy(); // cleanup old chart
}, [orders, activeSection]);



  useEffect(() => {
  if (!vendorId) return; // Stop if vendorId is invalid

  const fetchVendor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/vendors/${vendorId}`);
      setVendor(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchVendor();
}, [vendorId]);

useEffect(() => {
  if (!vendorId) return;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/vendor/${vendorId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchProducts();
}, [vendorId]);

useEffect(() => {
  if (!vendorId) return;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/vendor/${vendorId}`);
      setOrders(res.data.orders || []); // matches backend response
    } catch (err) {
      console.error(err);
    }
  };

  fetchOrders();
}, [vendorId]);


  // ================= Product Form =================
  const handleProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/products/add", {
        ...newProduct,
        vendorId,
      });
      setProducts([...products, res.data]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image: "",
        carbonFootprint: "",
        sustainabilityRating: "",
        category: "",
        video: "",
        pieces: 1,
      });
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  // ================= Change Password =================
  const changePassword = async () => {
    try {
      await axios.put(`http://localhost:5000/api/vendors/${vendorId}/change-password`, passwords);
      alert("Password changed successfully");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      alert("Error changing password");
    }
  };

  // ================= Render =================
  const renderContent = () => {
    switch (activeSection) {
      case "store":
  return (
    <div className="store-dashboard">
      <div className="welcome-card">
        <h2>Hello {vendor?.fullName || "Vendor"} 👋</h2>
        <h3>
          Thank you for your effort and{" "}
          {vendor?.storeName || "your store"} in taking steps to protect the planet 🌱
        </h3>
        <p>Welcome to RequireCo. This is your personalized Dashboard.</p>
      </div>

      <div className="profile-overview">
        <h4>Profile Overview | プロフィールの概要</h4>
        <div className="profile-cards">
          <div className="profile-card">
            <span className="label">Name | 名前</span>
            <span className="value">{vendor.fullName}</span>
          </div>
          <div className="profile-card">
            <span className="label">Store | 店名</span>
            <span className="value">{vendor.storeName}</span>
          </div>
          <div className="profile-card">
            <span className="label">Address | 店舗住所</span>
            <span className="value">{vendor.storeAddress}</span>
          </div>
          <div className="profile-card">
            <span className="label">Contact | 連絡先番号</span>
            <span className="value">{vendor.storeContact}</span>
          </div>
          <div className="profile-card">
            <span className="label">Coordinates | コーディネート</span>
            <span className="value">
              {vendor.storeCoordinates?.coordinates?.[1]}, {vendor.storeCoordinates?.coordinates?.[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

      case "products":
        return (
          <div>
            <h2>📦 Product Management</h2>

            {/* Add Product Form */}
            <form onSubmit={addProduct} className="product-form">
              <input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleProductChange} required />
              <input name="description" placeholder="Description" value={newProduct.description} onChange={handleProductChange} required />
              <input name="price" type="number" placeholder="Price" value={newProduct.price} onChange={handleProductChange} required />
              <input name="pieces" type="number" placeholder="Pieces" value={newProduct.pieces} onChange={handleProductChange} required />
              <input name="category" placeholder="Category" value={newProduct.category} onChange={handleProductChange} />
              <input name="image" placeholder="Image URL" value={newProduct.image} onChange={handleProductChange} />
              <input name="video" placeholder="Video URL" value={newProduct.video} onChange={handleProductChange} />
              <input name="carbonFootprint" type="number" step="0.01" placeholder="Carbon Footprint" value={newProduct.carbonFootprint} onChange={handleProductChange} />
              <input name="sustainabilityRating" type="number" step="0.1" placeholder="Sustainability Rating" value={newProduct.sustainabilityRating} onChange={handleProductChange} />
              <button type="submit">Add Product</button>
            </form>

            {/* Existing Products */}
           <h3>Your Products</h3>
<div className="product-list">
  {products.map((p) => (
    <div key={p._id} className="product-card">
      {p.image && <img src={p.image} alt={p.name} width={100} />}
      <h4>{p.name}</h4>
      <p>{p.description}</p>
      <p>₹{p.price} | {p.pieces} pcs</p>
      <p>Category: {p.category}</p>
      <p>Carbon: {p.carbonFootprint} | Rating: {p.sustainabilityRating}</p>
    </div>
  ))}
</div>

          </div>
        );

     case "orders":
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/update-status`, { status: newStatus });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };
  

  return (
    <div className="orders-dashboard">
      <h2>📑 Order Management</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders yet.</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <h3>Order #{order._id}</h3>
              <p className="customer-info">
                <strong>Customer:</strong> {order.userId?.name}<br />
                <span>{order.userId?.email || "N/A"}</span>
              </p>
              <ul className="order-products">
                {order.products.map((item, idx) => (
                  <li key={idx} className="order-product-item">
                    <strong>{item.productId?.name}</strong> – {item.quantity} pcs
                  </li>
                ))}
              </ul>
              <div className="order-footer">
                <div className="order-total">
                  <strong>Total:</strong> ₹{order.totalAmount}
                </div>
                <div className="order-status">
                  <strong>Status:</strong>
                  <select
  value={order.status}
  onChange={(e) => handleStatusChange(order._id, e.target.value)}
>
  <option value="pending">Pending</option>
  <option value="processing">Processing</option>
  <option value="shipped">Shipped</option>
  <option value="cancelled">Cancelled</option>
</select>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );



case "analytics":
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  return (
    <div className="analytics-dashboard">
      <h2>💰 Sales & Analytics | 販売と分析</h2>
      <ul className="analytics-list">
        <li>Total Products: {totalProducts}</li>
        <li>Total Orders: {totalOrders}</li>
        <li>Total Sales (₹): {totalSales}</li>
        <li>Pending Orders: {pendingOrders}</li>
      </ul>
      <div className="charts-container">
        <canvas ref={chartRef} width={600} height={400}></canvas>
      </div>
    </div>
  );


      case "settings":
        return (
          <div>
            <h2>⚙️ Settings</h2>
            <h4>Change Password</h4>
            <input type="password" placeholder="Old Password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} />
            <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            <button onClick={changePassword}>Update Password</button>
          <LogoutButton />

          </div>
          
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="vendor-dashboard">
      <div className="vendor-sidebar">
        <h3>Vendor Panel</h3>
        <h3>ベンダーパネル</h3>
        <ul>
          <li onClick={() => setActiveSection("store")}>🏬 Store | ストアー</li>
          <li onClick={() => setActiveSection("products")}>📦 Products | 製品</li>
          <li onClick={() => setActiveSection("orders")}>📑 Orders | 注文</li>
          <li onClick={() => setActiveSection("analytics")}>💰 Analytics | 分析</li>
          <li onClick={() => setActiveSection("settings")}>⚙️ Settings | 設定</li>
        </ul>
      </div>

      <div className="vendor-main-content">{renderContent()}</div>
    </div>
  );
};

export default VendorDashboard;
