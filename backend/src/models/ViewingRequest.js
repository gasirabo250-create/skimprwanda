const mongoose = require('mongoose');

const viewingRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['New', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'New',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ViewingRequest', viewingRequestSchema);
