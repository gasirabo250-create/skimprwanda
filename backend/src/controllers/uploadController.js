const asyncHandler = require('../utils/asyncHandler');

// @desc    Upload one or more images
// @route   POST /api/upload
// @access  Private (admin)
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const urls = req.files.map((f) => `${baseUrl}/uploads/${f.filename}`);
  res.status(201).json({ success: true, data: urls });
});

module.exports = { uploadImages };
