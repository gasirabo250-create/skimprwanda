const asyncHandler = require('../utils/asyncHandler');
const Model = require('../models/Model');
const makeSlug = require('../utils/slugify');

const getModels = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.brandId) query.brandId = req.query.brandId;
  const models = await Model.find(query).populate('brandId', 'name slug').sort('name');
  res.json({ success: true, data: models });
});

const createModel = asyncHandler(async (req, res) => {
  const { name, brandId, bodyType } = req.body;
  if (!name || !brandId) {
    res.status(400);
    throw new Error('Model name and brandId are required');
  }
  const slug = makeSlug(name);
  const model = await Model.create({ name, slug, brandId, bodyType });
  res.status(201).json({ success: true, data: model });
});

const updateModel = asyncHandler(async (req, res) => {
  const model = await Model.findById(req.params.id);
  if (!model) {
    res.status(404);
    throw new Error('Model not found');
  }
  if (req.body.name) req.body.slug = makeSlug(req.body.name);
  Object.assign(model, req.body);
  await model.save();
  res.json({ success: true, data: model });
});

const deleteModel = asyncHandler(async (req, res) => {
  const model = await Model.findById(req.params.id);
  if (!model) {
    res.status(404);
    throw new Error('Model not found');
  }
  await model.deleteOne();
  res.json({ success: true, message: 'Model deleted' });
});

module.exports = { getModels, createModel, updateModel, deleteModel };
