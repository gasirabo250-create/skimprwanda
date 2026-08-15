const express = require('express');
const {
  getModels,
  createModel,
  updateModel,
  deleteModel,
} = require('../controllers/modelController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getModels);
router.post('/', protect, createModel);
router.put('/:id', protect, updateModel);
router.delete('/:id', protect, deleteModel);

module.exports = router;
