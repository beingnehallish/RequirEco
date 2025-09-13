// src/layouts/VendorLayout.jsx
import React from "react";

const VendorLayout = ({ children }) => {
  return (
    <div className="vendor-layout">
      {/* No Navbar here */}
      {children}
    </div>
  );
};

export default VendorLayout;
