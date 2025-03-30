// controllers/miner.controller.js
const { Miner } = require('../models/miner.model');
const UserMiner = require('../models/userMiner.model');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const Referral = require('../models/referral.model');
const config = require('../config/environment');
const notificationService = require('../services/notification.service');

/**
 * Get all available miners
 */
const getAllMiners = async (req, res) => {
  try {
    const miners = await Miner.find({ isActive: true });
    
    return res.status(200).json({
      success: true,
      miners
    });
  } catch (error) {
    console.error('Get all miners error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching miners' 
    });
  }
};

/**
 * Get user's miners
 */
const getUserMiners = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userMiners = await UserMiner.find({ userId });
    
    // Get miner details for each user miner
    const minerDetails = await Promise.all(
      userMiners.map(async (userMiner) => {
        const miner = await Miner.findOne({ minerId: userMiner.minerId });
        
        return {
          id: userMiner._id,
          minerId: userMiner.minerId,
          name: miner ? miner.name : 'Unknown Miner',
          purchaseAmount: userMiner.purchaseAmount,
          profitRate: userMiner.profitRate,
          dailyProfit: userMiner.purchaseAmount * userMiner.profitRate,
          totalProfit: userMiner.totalProfit,
          isActive: userMiner.isActive,
          purchasedAt: userMiner.createdAt
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      miners: minerDetails
    });
  } catch (error) {
    console.error('Get user miners error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching user miners' 
    });
  }
};

/**
 * Purchase a miner
 */
const purchaseMiner = async (req, res) => {
  try {
    const userId = req.user.id;
    const { minerId, amount } = req.body;
    
    if (!minerId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Miner ID and amount are required' 
      });
    }
    
    const purchaseAmount = parseFloat(amount);
    
    if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid purchase amount' 
      });
    }
    
    // Find the miner
    const miner = await Miner.findOne({ minerId, isActive: true });
    if (!miner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Miner not found or inactive' 
      });
    }
    
    // Check if user has enough balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const totalCost = purchaseAmount;
    
    if (user.balance < totalCost) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }
    
    // Create or update user miner
    let userMiner = await UserMiner.findOne({ userId, minerId: miner.minerId });
    
    if (userMiner) {
      // Update existing miner
      userMiner.purchaseAmount += purchaseAmount;
      userMiner.isActive = true;
    } else {
      // Create new user miner
      userMiner = new UserMiner({
        userId,
        minerId: miner.minerId,
        purchaseAmount,
        profitRate: miner.profitRate,
        isActive: true
      });
    }
    
    await userMiner.save();
    
    // Update user balance
    user.balance -= totalCost;
    await user.save();
    
    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'miner_purchase',
      amount: totalCost,
      status: 'completed',
      description: `Purchased ${miner.name} for ${totalCost} USDT`,
      minerData: {
        minerId: miner.minerId,
        minerName: miner.name
      }
    });
    
    await transaction.save();
    
    // Check if user was referred and this is their first miner purchase
    if (user.referredBy) {
      const referral = await Referral.findOne({ 
        referrerId: user.referredBy, 
        referredId: userId 
      });
      
      if (referral && !referral.minerPurchased) {
        // Calculate commission
        const commissionRate = config.referral.commissionRate;
        const commission = totalCost * commissionRate;
        
        // Update referral record
        referral.minerPurchased = true;
        referral.commission = commission;
        referral.status = 'rewarded';
        await referral.save();
        
        // Add commission to referrer's balance
        const referrer = await User.findById(user.referredBy);
        if (referrer) {
          referrer.balance += commission;
          referrer.referralEarnings += commission;
          await referrer.save();
          
          // Create transaction record for referral commission
          const referralTransaction = new Transaction({
            userId: referrer._id,
            type: 'referral',
            amount: commission,
            status: 'completed',
            description: `Referral commission from ${user.name}'s first miner purchase`,
            referralData: {
              referrerId: referrer._id,
              referredId: userId
            }
          });
          
          await referralTransaction.save();
          
          // Send notification to referrer
          await notificationService.sendReferralCommissionEmail(referrer, commission, user);
        }
      }
    }
    
    // Send purchase confirmation email
    await notificationService.sendMinerPurchaseEmail(user, miner, totalCost);
    
    return res.status(200).json({
      success: true,
      message: 'Miner purchased successfully',
      miner: {
        id: userMiner._id,
        minerId: miner.minerId,
        name: miner.name,
        purchaseAmount: userMiner.purchaseAmount,
        profitRate: userMiner.profitRate,
        dailyProfit: userMiner.purchaseAmount * userMiner.profitRate,
        isActive: userMiner.isActive
      },
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Purchase miner error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while purchasing miner' 
    });
  }
};

/**
 * Activate/deactivate user's miner
 */
const toggleMinerStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userMinerId, active } = req.body;
    
    if (!userMinerId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Miner ID is required' 
      });
    }
    
    // Find the user miner
    const userMiner = await UserMiner.findOne({ _id: userMinerId, userId });
    if (!userMiner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Miner not found or does not belong to user' 
      });
    }
    
    // Update status
    userMiner.isActive = active !== undefined ? active : !userMiner.isActive;
    await userMiner.save();
    
    return res.status(200).json({
      success: true,
      message: `Miner ${userMiner.isActive ? 'activated' : 'deactivated'} successfully`,
      miner: {
        id: userMiner._id,
        isActive: userMiner.isActive
      }
    });
  } catch (error) {
    console.error('Toggle miner status error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating miner status' 
    });
  }
};

module.exports = {
  getAllMiners,
  getUserMiners,
  purchaseMiner,
  toggleMinerStatus
};