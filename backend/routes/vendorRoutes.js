// backend/routes/vendorRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { personalEmail, password } = req.body;
    const existing = await Vendor.findOne({ personalEmail });
    if (existing) return res.status(400).json({ error: "Vendor already exists" });

    const hashedPass = await bcrypt.hash(password, 10);
    const vendor = new Vendor({ ...req.body, password: hashedPass });
    await vendor.save();
    res.json({ success: true, message: "Vendor registered" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { personalEmail, password } = req.body;
    const vendor = await Vendor.findOne({ personalEmail });
    if (!vendor) return res.status(400).json({ error: "Vendor not found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    res.json({ success: true, vendorId: vendor._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Get Vendor Info
// backend/routes/vendorRoutes.js
router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor); // ✅ fullName and storeName included
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Change Password
router.put("/:id/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    const isMatch = await bcrypt.compare(oldPassword, vendor.password);
    if (!isMatch) return res.status(400).json({ error: "Old password incorrect" });

    vendor.password = await bcrypt.hash(newPassword, 10);
    await vendor.save();
    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find({}, "-password"); 
    res.json(vendors);
  } catch (err) {
    console.error("Error fetching vendors:", err);
    res.status(500).json({ error: "Server error while fetching vendors" });
  }
});
module.exports = router;
