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
const getAllMiners = async (request, reply) => {
  try {
    const miners = await Miner.find({ isActive: true });
    
    // Fastify response style
    return reply.send({
      success: true,
      miners
    });
  } catch (error) {
    console.error('Get all miners error:', error);
    return reply.code(500).send({ 
      success: false, 
      message: 'An error occurred while fetching miners' 
    });
  }
};

/**
 * Get user's miners
 */
const getUserMiners = async (request, reply) => {
  try {
    const userId = request.user.id;
    
    // Get all user miners
    const userMiners = await UserMiner.find({ userId });
    
    // Get all miner IDs from user miners
    const minerIds = userMiners.map(um => um.minerId);
    
    // Get all miners in one query
    const miners = await Miner.find({ minerId: { $in: minerIds } });
    
    // Create a map for quick lookup
    const minerMap = {};
    miners.forEach(miner => {
      minerMap[miner.minerId] = miner;
    });
    
    // Map user miners to response format
    const minerDetails = userMiners.map(userMiner => {
      const miner = minerMap[userMiner.minerId] || {};
      
      return {
        id: userMiner._id,
        minerId: userMiner.minerId,
        name: miner.name || 'Unknown Miner',
        purchaseAmount: userMiner.purchaseAmount || 0,
        profitRate: userMiner.profitRate || 0,
        dailyProfit: (userMiner.purchaseAmount || 0) * (userMiner.profitRate || 0),
        totalProfit: userMiner.totalProfit || 0,
        isActive: !!userMiner.isActive,
        purchasedAt: userMiner.createdAt
      };
    });
    
    // Fastify response style
    return reply.send({
      success: true,
      miners: minerDetails
    });
  } catch (error) {
    console.error('Get user miners error:', error);
    return reply.code(500).send({ 
      success: false, 
      message: 'An error occurred while fetching user miners' 
    });
  }
};

/**
 * Purchase a miner
 */
const purchaseMiner = async (request, reply) => {
  try {
    const userId = request.user.id;
    const { minerId, amount } = request.body;
    
    if (!minerId || !amount) {
      return reply.code(400).send({ 
        success: false, 
        message: 'Miner ID and amount are required' 
      });
    }
    
    const purchaseAmount = parseFloat(amount);
    
    if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
      return reply.code(400).send({ 
        success: false, 
        message: 'Invalid purchase amount' 
      });
    }
    
    // Find the miner
    const miner = await Miner.findOne({ minerId, isActive: true });
    if (!miner) {
      return reply.code(404).send({ 
        success: false, 
        message: 'Miner not found or inactive' 
      });
    }
    
    // Check if user has enough balance
    const user = await User.findById(userId);
    if (!user) {
      return reply.code(404).send({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const totalCost = purchaseAmount;
    
    if (user.balance < totalCost) {
      return reply.code(400).send({ 
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
    
    // Fastify response style
    return reply.send({
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
    return reply.code(500).send({ 
      success: false, 
      message: 'An error occurred while purchasing miner' 
    });
  }
};

/**
 * Activate/deactivate user's miner
 */
const toggleMinerStatus = async (request, reply) => {
  try {
    const userId = request.user.id;
    const { userMinerId, active } = request.body;
    
    if (!userMinerId) {
      return reply.code(400).send({ 
        success: false, 
        message: 'Miner ID is required' 
      });
    }
    
    // Find the user miner
    const userMiner = await UserMiner.findOne({ _id: userMinerId, userId });
    if (!userMiner) {
      return reply.code(404).send({ 
        success: false, 
        message: 'Miner not found or does not belong to user' 
      });
    }
    
    // Update status
    userMiner.isActive = active !== undefined ? active : !userMiner.isActive;
    await userMiner.save();
    
    // Fastify response style
    return reply.send({
      success: true,
      message: `Miner ${userMiner.isActive ? 'activated' : 'deactivated'} successfully`,
      miner: {
        id: userMiner._id,
        isActive: userMiner.isActive
      }
    });
  } catch (error) {
    console.error('Toggle miner status error:', error);
    return reply.code(500).send({ 
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