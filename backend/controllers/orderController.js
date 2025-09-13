const Order = require('../models/Order');
const User = require('../models/User');

exports.placeOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    let carbonSaved = 0;
    products.forEach(p => carbonSaved += p.carbonFootprint * p.quantity);
    const order = await Order.create({
      userId: req.user._id,
      products,
      totalAmount,
      carbonSaved
    });
    await User.findByIdAndUpdate(req.user._id, { impactPoints: carbonSaved });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate('products.productId');
  res.json(orders);
};