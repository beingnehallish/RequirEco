import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Vendor.css";

const VendorSignup = () => {
  const [form, setForm] = useState({
    fullName: "",
    personalEmail: "",
    phoneNumber: "",
    storeName:"",
    storeContact: "",
    storeAddress: "",
    latitude: "",
    longitude: "",
    password: "",
    confirmPassword: "",
  });

  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Prepare GeoJSON structure
    const vendorData = {
      fullName: form.fullName,
      personalEmail: form.personalEmail,
      phoneNumber: form.phoneNumber,
      storeName: form.storeName,
      storeContact: form.storeContact,
      storeAddress: form.storeAddress,
      storeCoordinates: {
        type: "Point",
        coordinates: [parseFloat(form.longitude), parseFloat(form.latitude)],
      },
      password: form.password,
    };

    try {
      await axios.post("http://localhost:5000/api/vendors/register", vendorData);
      alert("Vendor registration successful!");
      navigate("/vendor-login");
    } catch (err) {
      console.error(err);
      alert("Error registering vendor.");
    }
  };

  return (
    <div className="vendor-fullscreen">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate("/signup")}>
        ⬅ Back
      </button>

      <div className="vendor-form">
        <h3>Vendor Registration  </h3>
        <h2>ベンダー登録</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="personalEmail"
            placeholder="Personal Email"
            onChange={handleChange}
            required
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />
          <input
            name="storeName"
            placeholder="Store Name"
            onChange={handleChange}
            required
          />
          <input
            name="storeContact"
            placeholder="Store Contact Number"
            onChange={handleChange}
            required
          />
          <input
            name="storeAddress"
            placeholder="Store Address"
            onChange={handleChange}
            required
          />

          {/* Latitude & Longitude */}
          <input
            type="number"
            step="any"
            name="latitude"
            placeholder="Store Latitude"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            step="any"
            name="longitude"
            placeholder="Store Longitude"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          {/* Terms link */}
          <p className="terms-link" onClick={() => setShowTerms(true)}>
            📜 Read our Terms & Conditions
          </p>

          {/* Checkbox */}
          <label className="terms-checkbox">
            <input
              type="checkbox"  className="big-checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            I agree to the Terms & Conditions
          </label>

          <button type="submit" disabled={!acceptedTerms}>
            Register
          </button>
        </form>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="terms-popup-backdrop">
          <div className="terms-popup">
            <h3>Vendor Terms & Conditions</h3>
            <div className="terms-content">
              <p>
                Welcome to EcoCart Vendor Platform. By registering, you agree to
                the following terms and conditions:
              </p>
              <ol>
              
    <li>
      <strong>Store Authenticity:</strong> Vendors are required to provide complete, accurate, and verifiable information regarding their store identity, including business registration, contact details, and product descriptions. Misrepresentation may result in suspension or termination.
    </li><br></br>
    <li>
      <strong>Product Responsibility:</strong> Vendors shall bear full responsibility for the quality, safety, legality, and compliance of all products listed. Products must meet applicable regulatory standards and must not pose harm to consumers or the environment.
    </li><br></br>
    <li>
      <strong>Compliance:</strong> Vendors must operate in full compliance with all applicable local, national, and international laws, including consumer protection, taxation, labeling, and import/export regulations.
    </li><br></br>
    <li>
      <strong>Fair Pricing:</strong> All products must reflect fair and transparent pricing. Vendors shall not engage in deceptive pricing practices, including artificial inflation or misrepresentation of discounts.
    </li><br></br>
    <li>
      <strong>Sustainability:</strong> EcoCart encourages vendors to adopt environmentally responsible practices such as sustainable sourcing, minimal packaging, and carbon-conscious logistics. Vendors demonstrating eco-conscious behavior may receive platform recognition.
    </li><br></br>
    <li>
      <strong>Data Use:</strong> Vendor data collected by EcoCart shall be used exclusively for operational, analytical, and business development purposes. Data will not be sold or disclosed to third parties without consent, except as required by law.
    </li><br></br>
    <li>
      <strong>Termination:</strong> EcoCart reserves the right to suspend or terminate vendor accounts for policy violations, fraudulent activity, or repeated customer complaints. Termination may occur with or without prior notice.
    </li><br></br>
    <li>
      <strong>Dispute Resolution:</strong> Any disputes arising between the Vendor and EcoCart shall be resolved in accordance with the laws of the applicable jurisdiction. Parties agree to attempt resolution through good-faith negotiation before pursuing legal remedies.
    </li><br></br>
    <li>
      <strong>Platform Rights:</strong> EcoCart retains the right to modify, update, or amend these terms at any time. Vendors will be notified of material changes, and continued use of the platform constitutes acceptance of the revised terms.
    </li><br></br>
    <li>
      <strong>Agreement:</strong> By checking the acceptance box and continuing to use the EcoCart vendor dashboard, the Vendor acknowledges and agrees to be bound by the terms outlined in this Agreement.
    </li><br></br>
    </ol>
            </div>
            <button className="close-btn" onClick={() => setShowTerms(false)}>
              Close
            </button>
          </div>
        </div>
      )}
        <div className="vendor-prompt" onClick={() => navigate('/vendor-login')}>
  Are you a registered vendor? Login here!
</div>
    </div>
    
  );
};

export default VendorSignup;
