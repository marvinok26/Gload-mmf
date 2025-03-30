// models/transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'profit', 'miner_purchase', 'referral'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  txHash: {
    type: String,
    sparse: true,
    index: true
  },
  address: {
    type: String
  },
  description: {
    type: String
  },
  minerData: {
    minerId: {
      type: String
    },
    minerName: {
      type: String
    }
  },
  referralData: {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    referredId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, { timestamps: true });

// Add indexes for common queries
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, type: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;