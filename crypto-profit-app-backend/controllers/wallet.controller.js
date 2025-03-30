// controllers/wallet.controller.js
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const cryptoService = require('../services/crypto.service');
const notificationService = require('../services/notification.service');

/**
 * Get user's deposit address
 */
const getDepositAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // If user doesn't have a deposit address, generate one
    if (!user.depositAddress) {
      try {
        const address = await cryptoService.generateDepositAddress(userId);
        
        return res.status(200).json({
          success: true,
          depositAddress: address
        });
      } catch (error) {
        console.error('Error generating deposit address:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to generate deposit address' 
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      depositAddress: user.depositAddress
    });
  } catch (error) {
    console.error('Get deposit address error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching deposit address' 
    });
  }
};

/**
 * Get user's wallet balance
 */
const getBalance = async (req, res) => {
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
      balance: user.balance,
      totalProfit: user.totalProfit
    });
  } catch (error) {
    console.error('Get balance error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching balance' 
    });
  }
};

/**
 * Request a withdrawal
 */
const requestWithdrawal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, address } = req.body;
    
    if (!amount || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount and withdrawal address are required' 
      });
    }
    
    const withdrawalAmount = parseFloat(amount);
    
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid withdrawal amount' 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (user.balance < withdrawalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }
    
    // Create withdrawal request
    try {
      const transaction = await cryptoService.createWithdrawalRequest(userId, withdrawalAmount, address);
      
      // Send notification emails
      await notificationService.sendWithdrawalRequestEmail(user, withdrawalAmount, address);
      await notificationService.notifyAdminOfWithdrawal(user, withdrawalAmount, address);
      
      return res.status(200).json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        transaction: {
          id: transaction._id,
          amount: transaction.amount,
          status: transaction.status,
          createdAt: transaction.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create withdrawal request' 
      });
    }
  } catch (error) {
    console.error('Withdrawal request error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing withdrawal request' 
    });
  }
};

/**
 * Get deposit history
 */
const getDepositHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const query = { 
      userId,
      type: 'deposit'
    };
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const deposits = await Transaction.find(query, null, options);
    const total = await Transaction.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      deposits,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get deposit history error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching deposit history' 
    });
  }
};

/**
 * Get withdrawal history
 */
const getWithdrawalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const query = { 
      userId,
      type: 'withdrawal'
    };
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const withdrawals = await Transaction.find(query, null, options);
    const total = await Transaction.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      withdrawals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get withdrawal history error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching withdrawal history' 
    });
  }
};

module.exports = {
  getDepositAddress,
  getBalance,
  requestWithdrawal,
  getDepositHistory,
  getWithdrawalHistory
};