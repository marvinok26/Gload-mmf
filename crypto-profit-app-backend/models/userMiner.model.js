// models/userMiner.model.js
const mongoose = require('mongoose');

const userMinerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  minerId: {
    type: String,
    required: true
  },
  purchaseAmount: {
    type: Number,
    required: true
  },
  profitRate: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  lastProfitUpdate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure a user can't have duplicate miners of the same type
userMinerSchema.index({ userId: 1, minerId: 1 });

const UserMiner = mongoose.model('UserMiner', userMinerSchema);

module.exports = UserMiner;