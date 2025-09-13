// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/userController');
const { updateUser } = require('../controllers/userController');
const User = require('../models/User');

router.get('/:id', getUserById); // GET /api/users/:id
router.put('/:id', updateUser); // PUT /api/users/:id
router.get('/:id/impact', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const moneySaved = user.impactPoints * 1.5; // ₹ per kg
  res.json({ co2Saved: user.impactPoints, moneySaved });
});

module.exports = router;
