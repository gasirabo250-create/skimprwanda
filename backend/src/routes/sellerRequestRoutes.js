const express = require('express');
const {
  createSellerRequest,
  getSellerRequests,
  updateSellerRequest,
} = require('../controllers/sellerRequestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createSellerRequest);
router.get('/', protect, getSellerRequests);
router.put('/:id', protect, updateSellerRequest);

module.exports = router;
