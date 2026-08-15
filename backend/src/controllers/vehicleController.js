const asyncHandler = require('../utils/asyncHandler');
const Vehicle = require('../models/Vehicle');
const makeSlug = require('../utils/slugify');

// @desc    Get vehicles with pagination, filters, search
// @route   GET /api/vehicles
// @access  Public
const getVehicles = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    brandId,
    modelId,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    bodyType,
    fuel,
    transmission,
    maxMileage,
    location,
    sort = '-createdAt',
    status,
  } = req.query;

  const query = {};

  // Public listing only shows Available/Reserved/Sold unless an admin explicitly filters status
  if (status) {
    query.status = status;
  } else if (!req.admin) {
    query.status = { $ne: 'Draft' };
  }

  if (brandId) query.brandId = brandId;
  if (modelId) query.modelId = modelId;
  if (bodyType) query.bodyType = bodyType;
  if (fuel) query.fuel = fuel;
  if (transmission) query.transmission = transmission;
  if (location) query.location = new RegExp(location, 'i');

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (minYear || maxYear) {
    query.year = {};
    if (minYear) query.year.$gte = Number(minYear);
    if (maxYear) query.year.$lte = Number(maxYear);
  }

  if (maxMileage) query.mileage = { $lte: Number(maxMileage) };

  if (search) {
    query.$or = [
      { description: new RegExp(search, 'i') },
      { color: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [vehicles, total] = await Promise.all([
    Vehicle.find(query)
      .populate('brandId', 'name slug logo')
      .populate('modelId', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Vehicle.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: vehicles,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// @desc    Get featured vehicles
// @route   GET /api/vehicles/featured
// @access  Public
const getFeaturedVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ featured: true, status: { $ne: 'Draft' } })
    .populate('brandId', 'name slug logo')
    .populate('modelId', 'name slug')
    .sort('-createdAt')
    .limit(8);
  res.json({ success: true, data: vehicles });
});

// @desc    Get recently added vehicles
// @route   GET /api/vehicles/recent
// @access  Public
const getRecentVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ status: { $ne: 'Draft' } })
    .populate('brandId', 'name slug logo')
    .populate('modelId', 'name slug')
    .sort('-createdAt')
    .limit(8);
  res.json({ success: true, data: vehicles });
});

// @desc    Get single vehicle by id or slug, increments view count
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  const vehicle = await Vehicle.findOne(isObjectId ? { _id: id } : { slug: id })
    .populate('brandId', 'name slug logo')
    .populate('modelId', 'name slug bodyType');

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  vehicle.views += 1;
  await vehicle.save();

  res.json({ success: true, data: vehicle });
});

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private (admin)
const createVehicle = asyncHandler(async (req, res) => {
  const payload = req.body;

  const Brand = require('../models/Brand');
  const Model = require('../models/Model');
  const brand = await Brand.findById(payload.brandId);
  const model = await Model.findById(payload.modelId);
  if (!brand || !model) {
    res.status(400);
    throw new Error('Invalid brand or model');
  }

  const baseSlug = makeSlug(`${brand.name}-${model.name}-${payload.year}`);
  let slug = baseSlug;
  let counter = 1;
  while (await Vehicle.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const vehicle = await Vehicle.create({ ...payload, slug });
  res.status(201).json({ success: true, data: vehicle });
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (admin)
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  Object.assign(vehicle, req.body);
  await vehicle.save();

  res.json({ success: true, data: vehicle });
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (admin)
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  await vehicle.deleteOne();
  res.json({ success: true, message: 'Vehicle deleted' });
});

module.exports = {
  getVehicles,
  getFeaturedVehicles,
  getRecentVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
