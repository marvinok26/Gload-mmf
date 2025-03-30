// src/services/wallet.service.js
import api from './api.service';

// Get deposit address
export const getDepositAddress = async () => {
  try {
    const response = await api.get('/api/wallet/address');
    return response;
  } catch (error) {
    console.error('Get deposit address error:', error);
    return { success: false, message: error.message || 'Failed to get deposit address' };
  }
};

// Get wallet balance
export const getBalance = async () => {
  try {
    const response = await api.get('/api/wallet/balance');
    return response;
  } catch (error) {
    console.error('Get balance error:', error);
    return { success: false, message: error.message || 'Failed to get balance' };
  }
};

// Request withdrawal
export const requestWithdrawal = async (amount, address) => {
  try {
    const response = await api.post('/api/wallet/withdraw', { amount, address });
    return response;
  } catch (error) {
    console.error('Withdrawal request error:', error);
    return { success: false, message: error.message || 'Withdrawal request failed' };
  }
};

// Get transaction history
export const getTransactionHistory = async (type, page = 1, limit = 10) => {
  try {
    const params = { page, limit };
    if (type) params.type = type;
    
    const response = await api.get('/api/user/transactions', params);
    return response;
  } catch (error) {
    console.error('Get transaction history error:', error);
    return { success: false, message: error.message || 'Failed to get transaction history' };
  }
};

// Get deposit history
export const getDepositHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/api/wallet/deposits', { page, limit });
    return response;
  } catch (error) {
    console.error('Get deposit history error:', error);
    return { success: false, message: error.message || 'Failed to get deposit history' };
  }
};

// Get withdrawal history
export const getWithdrawalHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/api/wallet/withdrawals', { page, limit });
    return response;
  } catch (error) {
    console.error('Get withdrawal history error:', error);
    return { success: false, message: error.message || 'Failed to get withdrawal history' };
  }
};