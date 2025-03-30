// controllers/user.controller.js
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const UserMiner = require('../models/userMiner.model');
const Referral = require('../models/referral.model');

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching profile data' 
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Update allowed fields
    if (name) user.name = name;
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating profile' 
    });
  }
};

/**
 * Get user transaction history
 */
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, page = 1, limit = 10 } = req.query;
    
    const query = { userId };
    if (type) query.type = type;
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const transactions = await Transaction.find(query, null, options);
    const total = await Transaction.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching transaction history' 
    });
  }
};

/**
 * Get user statistics
 */
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's miners
    const miners = await UserMiner.find({ userId, isActive: true });
    
    // Get today's profits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayProfits = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'profit',
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get yesterday's profits
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayProfits = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'profit',
          createdAt: { $gte: yesterday, $lt: today }
        }
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get weekly profits
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyProfits = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'profit',
          createdAt: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get referral stats
    const referralStats = await Referral.aggregate([
      {
        $match: {
          referrerId: userId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate mining power (sum of all miner rates)
    const miningPower = miners.reduce((total, miner) => {
      return total + (miner.profitRate * miner.purchaseAmount);
    }, 0);
    
    return res.status(200).json({
      success: true,
      stats: {
        todayProfit: todayProfits.length > 0 ? todayProfits[0].totalProfit : 0,
        yesterdayProfit: yesterdayProfits.length > 0 ? yesterdayProfits[0].totalProfit : 0,
        weeklyProfit: weeklyProfits.length > 0 ? weeklyProfits[0].totalProfit : 0,
        activeMiners: miners.length,
        miningPower,
        referrals: {
          total: referralStats.reduce((total, stat) => total + stat.count, 0),
          active: referralStats.find(s => s._id === 'active')?.count || 0,
          rewarded: referralStats.find(s => s._id === 'rewarded')?.count || 0
        }
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching user statistics' 
    });
  }
};

/**
 * Get referral data
 */
const getReferralData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get user's referrals
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
    
    // Calculate total earnings from referrals
    const earnings = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'referral'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    return res.status(200).json({
      success: true,
      referralCode: user.referralCode,
      totalEarnings: earnings.length > 0 ? earnings[0].total : 0,
      referrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get referral data error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching referral data' 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getTransactionHistory,
  getUserStats,
  getReferralData
};