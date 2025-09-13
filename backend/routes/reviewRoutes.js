// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST /api/reviews
router.post('/', async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.status(201).json(review);
});

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId });
  res.json(reviews);
});

module.exports = router;
