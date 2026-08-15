const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    // Check if connection is still alive
    if (mongoose.connection.readyState === 1) {
      return;
    }
  }

  try {
    const mongoUri = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('No MongoDB URI configured');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4 only
    });
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    isConnected = false;
    // Don't exit in serverless environments - allow graceful degradation
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
