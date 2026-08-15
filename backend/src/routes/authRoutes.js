const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, verify } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, login);
router.post('/logout', protect, logout);
router.get('/verify', protect, verify);

module.exports = router;
