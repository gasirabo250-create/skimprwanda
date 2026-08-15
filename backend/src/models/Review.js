const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    vehiclePurchased: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    photo: { type: String, default: '' },
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
