// services/profit.service.js
const User = require('../models/user.model');
const UserMiner = require('../models/userMiner.model');
const Transaction = require('../models/transaction.model');
const notificationService = require('./notification.service');
const config = require('../config/environment');

/**
 * Calculate daily profits for all active miners
 */
const calculateDailyProfits = async () => {
  try {
    console.log('Starting daily profit calculation');
    
    // Get all active user miners
    const activeMiners = await UserMiner.find({ isActive: true });
    console.log(`Found ${activeMiners.length} active miners`);
    
    // Track profits by user
    const userProfits = {};
    
    // Calculate profit for each miner
    for (const miner of activeMiners) {
      const dailyProfit = miner.purchaseAmount * miner.profitRate;
      
      // Initialize user profit if not exists
      if (!userProfits[miner.userId]) {
        userProfits[miner.userId] = 0;
      }
      
      // Add to user's total profit
      userProfits[miner.userId] += dailyProfit;
      
      // Update miner statistics
      miner.totalProfit += dailyProfit;
      miner.lastProfitUpdate = new Date();
      await miner.save();
      
      console.log(`Calculated profit for miner ${miner._id}: ${dailyProfit.toFixed(2)} USDT`);
    }
    
    // Process profits for each user
    for (const [userId, profit] of Object.entries(userProfits)) {
      await processProfitForUser(userId, profit);
    }
    
    console.log('Daily profit calculation completed');
    return { success: true };
  } catch (error) {
    console.error('Error calculating daily profits:', error);
    return { success: false, error };
  }
};

/**
 * Process profit for a specific user
 */
const processProfitForUser = async (userId, profit) => {
  try {
    // Round profit to 2 decimal places
    profit = parseFloat(profit.toFixed(2));
    
    // Skip if profit is zero or negative
    if (profit <= 0) {
      return { success: true, message: 'No profit to process' };
    }
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    // Update user balance and total profit
    user.balance += profit;
    user.totalProfit += profit;
    await user.save();
    
    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'profit',
      amount: profit,
      status: 'completed',
      description: 'Daily mining profit'
    });
    
    await transaction.save();
    
    // Send notification email if enabled
    if (config.app.env === 'production') {
      await notificationService.sendDailyProfitEmail(user, profit);
    }
    
    console.log(`Processed profit for user ${userId}: ${profit.toFixed(2)} USDT`);
    return { success: true };
  } catch (error) {
    console.error(`Error processing profit for user ${userId}:`, error);
    return { success: false, error };
  }
};

/**
 * Calculate profit for a specific user (for preview/testing)
 */
const calculateUserProfit = async (userId) => {
  try {
    // Get user's active miners
    const activeMiners = await UserMiner.find({ userId, isActive: true });
    
    // Calculate total profit
    let totalProfit = 0;
    
    for (const miner of activeMiners) {
      const dailyProfit = miner.purchaseAmount * miner.profitRate;
      totalProfit += dailyProfit;
    }
    
    return {
      success: true,
      userId,
      activeMiners: activeMiners.length,
      dailyProfit: parseFloat(totalProfit.toFixed(2)),
      miners: activeMiners.map(miner => ({
        id: miner._id,
        minerId: miner.minerId,
        purchaseAmount: miner.purchaseAmount,
        profitRate: miner.profitRate,
        dailyProfit: parseFloat((miner.purchaseAmount * miner.profitRate).toFixed(2))
      }))
    };
  } catch (error) {
    console.error(`Error calculating profit for user ${userId}:`, error);
    return { success: false, error };
  }
};

module.exports = {
  calculateDailyProfits,
  processProfitForUser,
  calculateUserProfit
};