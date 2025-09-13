const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const router = express.Router();

// 1. Place a new order
router.post("/", async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentStatus } = req.body;

    // Validate product availability
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.pieces < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      product.pieces -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentStatus: paymentStatus || "Pending",
      status: "Pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get orders by customer (for Dashboard)
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all orders for a specific vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Find orders that include this vendor's products
    const orders = await Order.find({ "products.vendorId": vendorId })
      .populate("products.productId", "name price")
      .populate("products.vendorId", "storeName fullName")
      .populate("userId", "name email"); // populate customer info

    // Filter products so vendor only sees their own
    const vendorOrders = orders.map(order => {
      const filteredProducts = order.products.filter(
        p => p.vendorId._id.toString() === vendorId
      );

      return {
        _id: order._id,
        userId: order.userId, // populated with name/email
        products: filteredProducts,
        totalAmount: filteredProducts.reduce((sum, p) => sum + p.price * p.quantity, 0),
        carbonSaved: order.carbonSaved,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });

    res.status(200).json({ orders: vendorOrders }); // wrap in orders for frontend
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
    res.status(500).json({ message: "Error fetching vendor orders", error: err });
  }
});

module.exports = router;
