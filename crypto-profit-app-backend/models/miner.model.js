// models/miner.model.js
const mongoose = require('mongoose');
const config = require('../config/environment');

const minerSchema = new mongoose.Schema({
  minerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  profitRate: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Miner = mongoose.model('Miner', minerSchema);

// Initialize default miners if they don't exist
const initializeMiners = async () => {
  try {
    const count = await Miner.countDocuments();
    
    // If there are no miners in the DB, create the default ones
    if (count === 0) {
      const defaultMiners = config.miners.types;
      
      for (const miner of defaultMiners) {
        await Miner.create({
          minerId: miner.id,
          name: miner.name,
          price: miner.price,
          profitRate: miner.profitRate,
          description: miner.description,
          imageUrl: miner.imageUrl,
          isActive: true
        });
      }
      
      console.log('Default miners initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing miners:', error);
  }
};

module.exports = {
  Miner,
  initializeMiners
};