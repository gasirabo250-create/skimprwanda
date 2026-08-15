require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to MongoDB asynchronously, don't block app initialization
if (!process.env.VERCEL || process.env.NODE_ENV === 'development') {
  connectDB().catch(err => console.error('MongoDB connection error:', err.message));
}

const app = express();

// Health check before DB (for serverless monitoring)
app.get('/health', (req, res) => res.status(200).json({ ok: true }));
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS configuration - allow all vercel.app origins and localhost for development
app.use(
  cors({
    origin: true, // Allow all origins (can be restricted later if needed)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-JSON-Response'],
    maxAge: 600,
  })
);

// Middleware to ensure DB is connected (lazy connect for serverless)
app.use(async (req, res, next) => {
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }
  
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err.message);
    // Continue anyway - some endpoints might not need DB
  }
  next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sanitize against NoSQL injection & XSS
app.use(mongoSanitize());
app.use(xss());

// Logging
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// General API rate limit
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Static file serving for locally-uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/admin', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/brands', require('./routes/brandRoutes'));
app.use('/api/models', require('./routes/modelRoutes'));
app.use('/api/viewing-requests', require('./routes/viewingRequestRoutes'));
app.use('/api/seller-requests', require('./routes/sellerRequestRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.use(notFound);
app.use(errorHandler);

// Only listen in local development, not on Vercel serverless
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`SKIMP Rwanda API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

module.exports = app;
