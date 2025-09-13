const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  
  personalEmail: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
 storeName: { type: String, required: true }, // ✅ Added Shop Name
  storeContact: { type: String, required: true },
  storeAddress: { type: String, required: true },
  
  // GeoJSON format
  storeCoordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  password: { type: String, required: true }
}, { timestamps: true });

// Enable geospatial queries
vendorSchema.index({ storeCoordinates: "2dsphere" });

module.exports = mongoose.model("Vendor", vendorSchema);
