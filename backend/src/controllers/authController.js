const asyncHandler = require('../utils/asyncHandler');
const Admin = require('../models/Admin');
const { generateToken, setTokenCookie } = require('../utils/generateToken');

// @desc    Log in an admin
// @route   POST /api/admin/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(admin._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    token, // also returned for non-cookie (e.g. mobile) clients
  });
});

// @desc    Log out an admin
// @route   POST /api/admin/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const cookieName = process.env.COOKIE_NAME || 'skimp_token';
  res.clearCookie(cookieName);
  res.json({ success: true, message: 'Logged out' });
});

// @desc    Verify current session / get logged-in admin
// @route   GET /api/admin/verify
// @access  Private
const verify = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = { login, logout, verify };
