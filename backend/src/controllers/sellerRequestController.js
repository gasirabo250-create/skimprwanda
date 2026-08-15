const asyncHandler = require('../utils/asyncHandler');
const SellerRequest = require('../models/SellerRequest');

const createSellerRequest = asyncHandler(async (req, res) => {
  const { name, phone, year, mileage, expectedPrice } = req.body;
  if (!name || !phone || !year || !mileage || !expectedPrice) {
    res.status(400);
    throw new Error('name, phone, year, mileage and expectedPrice are required');
  }
  const request = await SellerRequest.create(req.body);
  res.status(201).json({ success: true, data: request, message: 'Submission received' });
});

const getSellerRequests = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const requests = await SellerRequest.find(query).sort('-createdAt');
  res.json({ success: true, data: requests });
});

const updateSellerRequest = asyncHandler(async (req, res) => {
  const request = await SellerRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Seller request not found');
  }
  Object.assign(request, req.body);
  await request.save();
  res.json({ success: true, data: request });
});

module.exports = { createSellerRequest, getSellerRequests, updateSellerRequest };
