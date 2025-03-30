// models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  depositAddress: { 
    type: String,
    unique: true,
    sparse: true
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  totalProfit: { 
    type: Number, 
    default: 0 
  },
  referralCode: { 
    type: String,
    unique: true 
  },
  referredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Generate unique referral code if not already set
    if (!this.referralCode) {
      this.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a safe user object (without sensitive data)
userSchema.methods.toSafeObject = function() {
  const { _id, email, name, depositAddress, balance, totalProfit, referralCode, referralEarnings, createdAt } = this;
  return { 
    id: _id, 
    email, 
    name, 
    depositAddress, 
    balance, 
    totalProfit, 
    referralCode, 
    referralEarnings, 
    createdAt 
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;