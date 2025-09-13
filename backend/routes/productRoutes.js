const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const { getProducts, getProduct } = require('../controllers/productController');
// router.get('/', getProducts);
router.get('/:id', getProduct);
// Add Product
router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all products for a specific vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId }); // filter by vendorId
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching vendor products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


// Update Product
router.put("/:productId", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Product
router.delete("/:productId", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;