const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // List of products in the order
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true } // product.price * quantity
      }
    ],

    totalAmount: { type: Number, required: true },
    carbonSaved: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"],
      default: "Pending"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending"
    },

    shippingAddress: { type: String, required: true },
    trackingNumber: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
