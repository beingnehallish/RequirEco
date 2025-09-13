// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL of product image
  carbonFootprint: { type: Number }, // e.g., CO2 per product
  sustainabilityRating: { type: Number, min: 0, max: 5 }, // 0–5 scale
  category: { type: String }, // e.g., Personal Care, Food, etc.
  video: { type: String }, // YouTube embed link
  pieces: { type: Number, default: 1 }, // NEW field for number of items per product

  // Reference vendor
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
