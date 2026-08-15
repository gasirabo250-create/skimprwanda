/**
 * Seed script for SKIMP Rwanda.
 * Usage:
 *   npm run seed            -> wipes and reseeds brands/models/demo vehicles/admin/settings
 *   npm run seed:destroy    -> wipes all seeded collections
 *
 * All demo vehicles are flagged isDemo: true so they can be bulk-deleted
 * from the admin dashboard once real inventory is added.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const makeSlug = require('../utils/slugify');

const Admin = require('../models/Admin');
const Brand = require('../models/Brand');
const Model = require('../models/Model');
const Vehicle = require('../models/Vehicle');
const Settings = require('../models/Settings');
const Article = require('../models/Article');

// Unsplash "source" style placeholder images. Replace with real, licensed
// photography (or manufacturer press images) before going live.
const img = (query, seed) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=80&${encodeURIComponent(query)}`;

const brandsData = [
  { name: 'Toyota', models: [
    { name: 'RAV4', bodyType: 'SUV' },
    { name: 'Corolla', bodyType: 'Sedan' },
    { name: 'Land Cruiser Prado', bodyType: 'SUV' },
    { name: 'Hilux', bodyType: 'Pickup' },
    { name: 'Fortuner', bodyType: 'SUV' },
    { name: 'Harrier', bodyType: 'SUV' },
  ]},
  { name: 'Hyundai', models: [
    { name: 'Tucson', bodyType: 'SUV' },
    { name: 'Santa Fe', bodyType: 'SUV' },
    { name: 'Creta', bodyType: 'Crossover' },
    { name: 'Elantra', bodyType: 'Sedan' },
  ]},
  { name: 'Kia', models: [
    { name: 'Sportage', bodyType: 'SUV' },
    { name: 'Sorento', bodyType: 'SUV' },
    { name: 'Seltos', bodyType: 'Crossover' },
  ]},
  { name: 'Honda', models: [
    { name: 'CR-V', bodyType: 'SUV' },
    { name: 'Vezel', bodyType: 'Crossover' },
    { name: 'Civic', bodyType: 'Sedan' },
  ]},
  { name: 'Lexus', models: [
    { name: 'RX', bodyType: 'SUV' },
    { name: 'NX', bodyType: 'SUV' },
    { name: 'LX', bodyType: 'SUV' },
  ]},
  { name: 'Nissan', models: [
    { name: 'X-Trail', bodyType: 'SUV' },
    { name: 'Patrol', bodyType: 'SUV' },
  ]},
  { name: 'Suzuki', models: [
    { name: 'Vitara', bodyType: 'SUV' },
    { name: 'Jimny', bodyType: 'SUV' },
    { name: 'Swift', bodyType: 'Hatchback' },
  ]},
  { name: 'Mercedes-Benz', models: [
    { name: 'GLC', bodyType: 'SUV' },
    { name: 'C-Class', bodyType: 'Sedan' },
    { name: 'E-Class', bodyType: 'Sedan' },
  ]},
  { name: 'BMW', models: [
    { name: 'X3', bodyType: 'SUV' },
    { name: 'X5', bodyType: 'SUV' },
  ]},
  { name: 'BYD', models: [
    { name: 'Atto 3', bodyType: 'Crossover' },
    { name: 'Dolphin', bodyType: 'Hatchback' },
  ]},
  { name: 'Tesla', models: [
    { name: 'Model 3', bodyType: 'Sedan' },
    { name: 'Model Y', bodyType: 'SUV' },
  ]},
];

const fuels = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions = ['Automatic', 'Manual'];
const colors = ['Pearl White', 'Jet Black', 'Silver', 'Graphite Grey', 'Deep Blue', 'Red'];
const locations = ['Kigali - Kimironko', 'Kigali - Kacyiru', 'Kigali - Remera', 'Kigali - Nyarutarama'];
const unsplashSeeds = [
  '1503376780353-7e6692767b70', '1494905998402-395d579af36f', '1541899481282-d53bffe3c35d',
  '1502877338535-766e1452684a', '1552519507-da3b142c6e3d', '1580273916550-e323be2ae537',
  '1549317661-bd32c8ce0db2', '1553440569-bcc63803a83d', '1583121274602-3e2820c69888',
  '1511919884226-fd3cad34687c', '1567818735868-e71b99932e29', '1494976388531-d1058494cdd8',
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  await connectDB();

  const destroy = process.argv.includes('--destroy');

  console.log('Clearing existing data...');
  await Promise.all([
    Vehicle.deleteMany({}),
    Model.deleteMany({}),
    Brand.deleteMany({}),
    Article.deleteMany({}),
  ]);

  if (destroy) {
    console.log('Destroy complete. Collections cleared.');
    await mongoose.disconnect();
    process.exit(0);
  }

  // --- Admin user ---
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@skimprwanda.com').toLowerCase();
  await Admin.findOneAndDelete({ email: adminEmail });
  await Admin.create({
    email: adminEmail,
    password: process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!',
    name: process.env.SEED_ADMIN_NAME || 'SKIMP Admin',
    role: 'superadmin',
  });
  console.log(`Admin user created: ${adminEmail}`);

  // --- Settings ---
  await Settings.deleteMany({});
  await Settings.create({
    whatsappNumber: '+250793810796',
    phone: '+250793810796',
    email: 'info@skimprwanda.com',
    address: 'Kigali, Rwanda',
    instagramHandle: '@skimp_rwanda',
  });
  console.log('Settings initialized.');

  // --- Brands & Models ---
  const vehiclesToCreate = [];

  for (const b of brandsData) {
    const brand = await Brand.create({
      name: b.name,
      slug: makeSlug(b.name),
      featured: ['Toyota', 'Hyundai', 'Lexus', 'BMW'].includes(b.name),
    });

    for (const m of b.models) {
      const model = await Model.create({
        name: m.name,
        slug: makeSlug(m.name),
        brandId: brand._id,
        bodyType: m.bodyType,
      });

      // 1-2 demo vehicles per model
      const count = randomInt(1, 2);
      for (let i = 0; i < count; i++) {
        const year = randomInt(2018, 2024);
        const seedImg = randomFrom(unsplashSeeds);
        vehiclesToCreate.push({
          brandId: brand._id,
          modelId: model._id,
          year,
          price: randomInt(8, 65) * 1_000_000, // RWF
          mileage: randomInt(5000, 120000),
          fuel: m.bodyType === 'Hatchback' && b.name === 'BYD' ? 'Electric' : randomFrom(fuels),
          transmission: randomFrom(transmissions),
          engine: `${(randomInt(15, 35) / 10).toFixed(1)}L`,
          bodyType: m.bodyType,
          color: randomFrom(colors),
          seats: m.bodyType === 'Pickup' ? 4 : m.bodyType === 'Sedan' ? 5 : randomFrom([5, 7]),
          doors: m.bodyType === 'Pickup' || m.bodyType === 'Coupe' ? 2 : 4,
          driveType: m.bodyType === 'SUV' || m.bodyType === 'Pickup' ? randomFrom(['4WD', 'AWD']) : 'FWD',
          location: randomFrom(locations),
          condition: 'Used',
          description: `A well-maintained ${year} ${b.name} ${m.name}, imported and inspected. Full service history available on request.`,
          features: ['Air Conditioning', 'Bluetooth', 'Reverse Camera', 'Alloy Wheels', 'Cruise Control'],
          images: [
            { url: img(`${b.name} ${m.name}`, seedImg), isPrimary: true },
          ],
          status: 'Available',
          featured: Math.random() < 0.2,
          isDemo: true,
          views: randomInt(0, 500),
        });
      }
    }
  }

  await Vehicle.insertMany(vehiclesToCreate);
  console.log(`Seeded ${brandsData.length} brands, ${vehiclesToCreate.length} demo vehicles.`);

  // --- Sample articles ---
  await Article.insertMany([
    {
      title: 'How to Choose Your First Car in Rwanda',
      slug: makeSlug('How to Choose Your First Car in Rwanda'),
      category: 'Car Buying',
      excerpt: 'A practical guide for first-time buyers navigating the Kigali used car market.',
      content: 'Full article content goes here — replace with real, original SKIMP Rwanda editorial content before publishing.',
      author: 'SKIMP Rwanda',
      readTime: 6,
      published: true,
    },
    {
      title: 'Hybrid vs Petrol: What Makes Sense on Kigali Roads',
      slug: makeSlug('Hybrid vs Petrol What Makes Sense on Kigali Roads'),
      category: 'EV/Hybrid',
      excerpt: 'Fuel costs, maintenance, and resale value compared for the Rwandan market.',
      content: 'Full article content goes here — replace with real, original SKIMP Rwanda editorial content before publishing.',
      author: 'SKIMP Rwanda',
      readTime: 5,
      published: true,
    },
  ]);
  console.log('Seeded sample articles.');

  console.log('\nSeed complete.');
  console.log(`Admin login -> email: ${adminEmail} | password: ${process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'}`);
  console.log('IMPORTANT: change the admin password after first login.');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
