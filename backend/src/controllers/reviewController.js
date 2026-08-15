const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');

const getReviews = asyncHandler(async (req, res) => {
  const query = req.admin ? {} : { approved: true };
  const reviews = await Review.find(query).sort('-createdAt');
  res.json({ success: true, data: reviews });
});

const createReview = asyncHandler(async (req, res) => {
  const { customerName, rating, review } = req.body;
  if (!customerName || !rating || !review) {
    res.status(400);
    throw new Error('customerName, rating and review are required');
  }
  // Reviews submitted publicly must be approved by an admin before showing on site
  const created = await Review.create({ ...req.body, approved: !!req.admin });
  res.status(201).json({ success: true, data: created });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  Object.assign(review, req.body);
  await review.save();
  res.json({ success: true, data: review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { getReviews, createReview, updateReview, deleteReview };
