// models/referral.model.js
const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rewarded'],
    default: 'pending'
  },
  commission: {
    type: Number,
    default: 0
  },
  minerPurchased: {
    type: Boolean,
    default: false
  },
  commissionPaid: {
    type: Boolean,
    default: false
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }
}, { timestamps: true });

// Add indexes for common queries
referralSchema.index({ referrerId: 1 });
referralSchema.index({ referredId: 1 });
referralSchema.index({ status: 1 });

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;