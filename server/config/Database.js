const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
// const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    // logger.info('MongoDB is already connected');
    console.log("Mongo Atlas connected!");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // serverSelectionTimeoutMS: 10000,
      dbName: process.env.DB_NAME,
    });
    isConnected = true;
    // logger.info('MongoDB connected successfully');
    console.log("Mongo Atlas connected!");

    // Dynamically require all models
    const modelsPath = path.join(__dirname, "../models");
    fs.readdirSync(modelsPath).forEach((file) => {
      if (file.endsWith(".js")) {
        require(path.join(modelsPath, file));
      }
    });
    // logger.info('Mongoose models initialized');
    console.log("Mongoose models initialized");
  } catch (err) {
    // logger.error('MongoDB connection error:', err);
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  //   logger.warn('MongoDB disconnected');
  console.log("Mongodb disconnected");
});

mongoose.connection.on("reconnected", () => {
  isConnected = true;
  //   logger.info('MongoDB reconnected');
  console.log("Mongodb reconnected");
});

module.exports = connectDB;
