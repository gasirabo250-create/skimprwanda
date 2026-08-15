const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const vehicleSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
    slug: { type: String, required: true, unique: true, index: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true, index: true },
    mileage: { type: Number, required: true },
    fuel: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
      required: true,
    },
    transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
    engine: { type: String, default: '' },
    bodyType: {
      type: String,
      enum: ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Wagon', 'Crossover'],
      required: true,
    },
    color: { type: String, default: '' },
    seats: { type: Number, default: 5 },
    doors: { type: Number, default: 4 },
    driveType: { type: String, enum: ['FWD', 'RWD', 'AWD', '4WD'], default: 'FWD' },
    location: { type: String, default: 'Kigali' },
    condition: { type: String, enum: ['New', 'Used', 'Certified Pre-Owned'], default: 'Used' },
    description: { type: String, default: '' },
    features: [{ type: String }],
    images: [imageSchema],
    status: {
      type: String,
      enum: ['Draft', 'Available', 'Reserved', 'Sold'],
      default: 'Draft',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    isDemo: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

vehicleSchema.index({ brandId: 1, modelId: 1, year: -1 });
vehicleSchema.index({ price: 1, year: -1, bodyType: 1, fuel: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
