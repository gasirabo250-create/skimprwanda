const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, index: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    bodyType: {
      type: String,
      enum: ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Wagon', 'Crossover'],
      default: 'SUV',
    },
  },
  { timestamps: true }
);

modelSchema.index({ brandId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Model', modelSchema);
