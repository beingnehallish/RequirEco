import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored data (like vendorId, token, etc.)
    localStorage.clear(); // or localStorage.removeItem("vendorId") if you only want to remove specific keys

    // Redirect to home page
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        backgroundColor: "#e0e0e0",
        color: "#2e7d32",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "600",
        boxShadow: "6px 6px 12px #bebebe, -6px -6px 12px #ffffff",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) =>
        (e.target.style.boxShadow =
          "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff")
      }
      onMouseLeave={(e) =>
        (e.target.style.boxShadow =
          "6px 6px 12px #bebebe, -6px -6px 12px #ffffff")
      }
    >
      Logout
    </button>
  );
};

export default LogoutButton;
