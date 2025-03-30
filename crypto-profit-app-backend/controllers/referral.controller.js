// controllers/referral.controller.js
const User = require('../models/user.model');
const Referral = require('../models/referral.model');
const Transaction = require('../models/transaction.model');

/**
 * Get user's referral information
 */
const getReferralInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get count of referrals
    const totalReferrals = await Referral.countDocuments({ referrerId: userId });
    const activeReferrals = await Referral.countDocuments({ referrerId: userId, status: 'active' });
    const rewardedReferrals = await Referral.countDocuments({ referrerId: userId, status: 'rewarded' });
    
    // Get total earnings from referrals
    const earningsData = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'referral',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalEarnings = earningsData.length > 0 ? earningsData[0].totalEarnings : 0;
    
    return res.status(200).json({
      success: true,
      referralCode: user.referralCode,
      statistics: {
        totalReferrals,
        activeReferrals,
        rewardedReferrals,
        totalEarnings
      }
    });
  } catch (error) {
    console.error('Get referral info error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching referral information' 
    });
  }
};

/**
 * Get user's referrals list
 */
const getReferralsList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      populate: {
        path: 'referredId',
        select: 'name email createdAt'
      }
    };
    
    const referrals = await Referral.find({ referrerId: userId }, null, options);
    const total = await Referral.countDocuments({ referrerId: userId });
    
    return res.status(200).json({
      success: true,
      referrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get referrals list error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching referrals list' 
    });
  }
};

/**
 * Get referral earnings history
 */
const getReferralEarnings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const earnings = await Transaction.find(
      { userId, type: 'referral', status: 'completed' }, 
      null, 
      options
    );
    
    const total = await Transaction.countDocuments({ 
      userId, 
      type: 'referral', 
      status: 'completed' 
    });
    
    return res.status(200).json({
      success: true,
      earnings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get referral earnings error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching referral earnings' 
    });
  }
};

/**
 * Validate a referral code
 */
const validateReferralCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Referral code is required' 
      });
    }
    
    const referrer = await User.findOne({ referralCode: code });
    
    if (!referrer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid referral code' 
      });
    }
    
    return res.status(200).json({
      success: true,
      valid: true,
      referrer: {
        id: referrer._id,
        name: referrer.name
      }
    });
  } catch (error) {
    console.error('Validate referral code error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while validating referral code' 
    });
  }
};

module.exports = {
  getReferralInfo,
  getReferralsList,
  getReferralEarnings,
  validateReferralCode
};