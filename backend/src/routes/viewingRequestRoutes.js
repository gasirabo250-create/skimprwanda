const express = require('express');
const {
  createViewingRequest,
  getViewingRequests,
  updateViewingRequest,
} = require('../controllers/viewingRequestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createViewingRequest);
router.get('/', protect, getViewingRequests);
router.put('/:id', protect, updateViewingRequest);

module.exports = router;
