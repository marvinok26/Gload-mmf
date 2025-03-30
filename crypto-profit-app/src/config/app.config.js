// src/config/app.config.js
import { APP_NAME, APP_VERSION } from '../constants/app.constants';
import { API_BASE_URL } from '../constants/api.constants';

export default {
  name: APP_NAME,
  version: APP_VERSION,
  
  // API Configuration
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
  },
  
  // Authentication
  auth: {
    tokenStorageKey: 'auth_token',
    userStorageKey: 'user_data',
  },
  
  // App Settings
  settings: {
    theme: 'light', // default theme
    language: 'en', // default language
  },
  
  // Miner Settings
  miners: {
    minPurchaseAmount: 1,
    profitCalculationInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  
  // Wallet Settings
  wallet: {
    currency: 'USDT',
    network: 'TRC20',
    minWithdrawalAmount: 10,
  },
  
  // Referral Settings
  referral: {
    commissionRate: 0.1, // 10% commission
  }
};