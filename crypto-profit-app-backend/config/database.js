// config/database.js
const mongoose = require('mongoose');
const config = require('./environment');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri, config.database.options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;