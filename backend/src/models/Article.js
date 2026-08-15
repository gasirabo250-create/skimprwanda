const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ['Car Buying', 'Car Care', 'EV/Hybrid', 'Driving Tips'],
      required: true,
    },
    coverImage: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    author: { type: String, default: 'SKIMP Rwanda' },
    readTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
