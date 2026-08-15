const asyncHandler = require('../utils/asyncHandler');
const Brand = require('../models/Brand');
const makeSlug = require('../utils/slugify');

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort('name');
  res.json({ success: true, data: brands });
});

const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug });
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  res.json({ success: true, data: brand });
});

const createBrand = asyncHandler(async (req, res) => {
  const { name, logo, description, featured } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Brand name is required');
  }
  const slug = makeSlug(name);
  const brand = await Brand.create({ name, slug, logo, description, featured });
  res.status(201).json({ success: true, data: brand });
});

const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  if (req.body.name) req.body.slug = makeSlug(req.body.name);
  Object.assign(brand, req.body);
  await brand.save();
  res.json({ success: true, data: brand });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  await brand.deleteOne();
  res.json({ success: true, message: 'Brand deleted' });
});

module.exports = { getBrands, getBrandBySlug, createBrand, updateBrand, deleteBrand };
