#!/usr/bin/env node

/**
 * Daily profit calculation script
 * This script is meant to be run as a cron job once per day
 * to calculate and distribute profits to users with active miners
 */

// Load environment variables
require('dotenv').config();

// Connect to database
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const profitService = require('../services/profit.service');

// Main function
async function calculateProfits() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');
    
    // Calculate profits
    console.log('Starting profit calculation...');
    const result = await profitService.calculateDailyProfits();
    
    if (result.success) {
      console.log('Profit calculation completed successfully');
    } else {
      console.error('Profit calculation failed:', result.error);
    }
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('Error in profit calculation script:', error);
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    
    process.exit(1);
  }
}

// Run the script
calculateProfits();