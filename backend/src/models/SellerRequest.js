const mongoose = require('mongoose');

const sellerRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    brandName: { type: String, trim: true },
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
    modelName: { type: String, trim: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    expectedPrice: { type: Number, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Offer Made', 'Accepted', 'Rejected'],
      default: 'New',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellerRequest', sellerRequestSchema);
