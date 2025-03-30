// services/crypto.service.js
const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/environment');
const cryptoConfig = require('../config/crypto');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

// CoinPayments API configuration
const CP_API_URL = cryptoConfig.coinpayments.apiUrl;
const CP_API_KEY = cryptoConfig.coinpayments.apiKey;
const CP_API_SECRET = cryptoConfig.coinpayments.apiSecret;
const CP_MERCHANT_ID = cryptoConfig.coinpayments.merchantId;
const CP_IPN_SECRET = cryptoConfig.coinpayments.ipnSecret;

/**
 * Create HMAC signature for CoinPayments API
 */
const createHmacSignature = (payload) => {
  return crypto
    .createHmac('sha512', CP_API_SECRET)
    .update(payload)
    .digest('hex');
};

/**
 * Make a request to CoinPayments API
 */
const makeApiRequest = async (params) => {
  try {
    const payload = new URLSearchParams(params).toString();
    const hmac = createHmacSignature(payload);
    
    const response = await axios.post(CP_API_URL, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'HMAC': hmac
      }
    });
    
    if (response.data.error !== 'ok') {
      throw new Error(`CoinPayments API error: ${response.data.error}`);
    }
    
    return response.data.result;
  } catch (error) {
    console.error('CoinPayments API error:', error);
    throw error;
  }
};

/**
 * Generate a deposit address for a user
 */
const generateDepositAddress = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // If user already has an address, return it
    if (user.depositAddress) {
      return user.depositAddress;
    }
    
    // Call CoinPayments API to create a new deposit address
    const params = {
      cmd: 'get_callback_address',
      key: CP_API_KEY,
      version: '1',
      currency: cryptoConfig.coinpayments.currency,
      ipn_url: cryptoConfig.getCallbackUrl(userId)
    };
    
    const result = await makeApiRequest(params);
    
    // Update user with new deposit address
    user.depositAddress = result.address;
    await user.save();
    
    return result.address;
  } catch (error) {
    console.error('Error generating deposit address:', error);
    throw new Error('Failed to generate deposit address');
  }
};

/**
 * Process a deposit notification from CoinPayments IPN
 */
const processDeposit = async (userId, paymentData) => {
  try {
    const {
      txn_id,
      amount,
      status,
      address
    } = paymentData;
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if this transaction has already been processed
    const existingTransaction = await Transaction.findOne({ txHash: txn_id });
    if (existingTransaction) {
      // If status is the same, no update needed
      if (existingTransaction.status === getTransactionStatus(status)) {
        return { success: true, updated: false };
      }
      
      // Update transaction status
      existingTransaction.status = getTransactionStatus(status);
      await existingTransaction.save();
      
      // If now complete, update user balance
      if (existingTransaction.status === 'completed' && existingTransaction.type === 'deposit') {
        user.balance += parseFloat(amount);
        await user.save();
      }
      
      return { success: true, updated: true };
    }
    
    // Create new transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'deposit',
      amount: parseFloat(amount),
      status: getTransactionStatus(status),
      txHash: txn_id,
      address
    });
    
    await transaction.save();
    
    // If complete, update user balance
    if (transaction.status === 'completed') {
      user.balance += parseFloat(amount);
      await user.save();
    }
    
    return { success: true, created: true };
  } catch (error) {
    console.error('Error processing deposit:', error);
    throw new Error('Failed to process deposit');
  }
};

/**
 * Convert CoinPayments status to our internal status
 */
const getTransactionStatus = (cpStatus) => {
  // CoinPayments statuses:
  // -2 = Refund or Reversal
  // -1 = Cancelled / Timed Out
  // 0 = Waiting for buyer funds
  // 1 = Waiting for merchant confirmation (only if you have confirmation enabled)
  // 2 = Waiting for coin confirmation (waiting for minimum confirmations)
  // 3 = Waiting for buyer confirmation (credit card payments)
  // 100 = Complete
  
  switch (parseInt(cpStatus)) {
    case 100:
      return 'completed';
    case -1:
    case -2:
      return 'failed';
    case 0:
    case 1:
    case 2:
    case 3:
      return 'pending';
    default:
      return 'pending';
  }
};

/**
 * Verify IPN request from CoinPayments
 */
const verifyIpnRequest = (requestData, hmacHeader) => {
  if (!hmacHeader) {
    return false;
  }
  
  // For this to work, the raw POST data needs to be passed
  const calculatedHmac = crypto
    .createHmac('sha512', CP_IPN_SECRET)
    .update(requestData)
    .digest('hex');
  
  return calculatedHmac === hmacHeader;
};

/**
 * Create a withdrawal request
 * Note: For a simple app, we'll just record the request rather than 
 * actually triggering the withdrawal through the API
 */
const createWithdrawalRequest = async (userId, amount, address) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'withdrawal',
      amount: parseFloat(amount),
      status: 'pending',
      address
    });
    
    await transaction.save();
    
    // Deduct from user's available balance
    user.balance -= parseFloat(amount);
    await user.save();
    
    return transaction;
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    throw new Error('Failed to create withdrawal request');
  }
};

/**
 * Get transaction info from CoinPayments
 */
const getTransactionInfo = async (txId) => {
  try {
    const params = {
      cmd: 'get_tx_info',
      key: CP_API_KEY,
      version: '1',
      txid: txId
    };
    
    const result = await makeApiRequest(params);
    return result;
  } catch (error) {
    console.error('Error getting transaction info:', error);
    throw new Error('Failed to get transaction info');
  }
};

module.exports = {
  generateDepositAddress,
  processDeposit,
  verifyIpnRequest,
  createWithdrawalRequest,
  getTransactionInfo
};