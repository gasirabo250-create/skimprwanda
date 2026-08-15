const asyncHandler = require('../utils/asyncHandler');
const ViewingRequest = require('../models/ViewingRequest');

const createViewingRequest = asyncHandler(async (req, res) => {
  const { name, phone, vehicleId, preferredDate, preferredTime } = req.body;
  if (!name || !phone || !vehicleId || !preferredDate || !preferredTime) {
    res.status(400);
    throw new Error('name, phone, vehicleId, preferredDate and preferredTime are required');
  }
  const request = await ViewingRequest.create(req.body);
  res.status(201).json({ success: true, data: request, message: 'Viewing request received' });
});

const getViewingRequests = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const requests = await ViewingRequest.find(query)
    .populate({ path: 'vehicleId', populate: [{ path: 'brandId' }, { path: 'modelId' }] })
    .sort('-createdAt');
  res.json({ success: true, data: requests });
});

const updateViewingRequest = asyncHandler(async (req, res) => {
  const request = await ViewingRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Viewing request not found');
  }
  Object.assign(request, req.body);
  await request.save();
  res.json({ success: true, data: request });
});

module.exports = { createViewingRequest, getViewingRequests, updateViewingRequest };
