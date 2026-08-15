const express = require('express');
const {
  getVehicles,
  getFeaturedVehicles,
  getRecentVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/featured', getFeaturedVehicles);
router.get('/recent', getRecentVehicles);
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

router.post('/', protect, createVehicle);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, deleteVehicle);

module.exports = router;
