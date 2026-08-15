const mongoose = require('mongoose');

// Singleton document — there should only ever be one Settings row.
const settingsSchema = new mongoose.Schema(
  {
    whatsappNumber: { type: String, default: '+250793810796' },
    phone: { type: String, default: '+250793810796' },
    email: { type: String, default: 'info@skimprwanda.com' },
    address: { type: String, default: 'Kigali, Rwanda' },
    mapUrl: { type: String, default: '' },
    instagramHandle: { type: String, default: '@skimp_rwanda' },
    facebookUrl: { type: String, default: '' },
    businessHours: {
      type: Object,
      default: {
        monFri: '8:00 AM - 6:00 PM',
        saturday: '9:00 AM - 4:00 PM',
        sunday: 'Closed',
      },
    },
    homepageHero: {
      title: { type: String, default: 'Your next car is closer than you think.' },
      subtitle: {
        type: String,
        default: 'Quality vehicles. Clear information. A simpler way to buy.',
      },
    },
    aboutContent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
