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

connectDB();

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://skimprwanda.vercel.app',
  'https://www.skimprwanda.vercel.app',
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_LOCAL,
  process.env.CLIENT_URL_PROD,
].filter(Boolean);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS - allow local dev and deployed Vercel origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

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

app.get('/api/health', (req, res) => res.json({ success: true, message: 'SKIMP Rwanda API is running' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SKIMP Rwanda API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
