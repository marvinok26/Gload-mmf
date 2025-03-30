// src/constants/app.constants.js

// App info
export const APP_NAME = 'Crypto Profit App';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};

// Miner types
export const MINER_TYPES = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  PREMIUM: 'premium',
};

// Transaction types
export const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    PROFIT: 'profit',
    MINER_PURCHASE: 'miner_purchase',
    REFERRAL: 'referral',
  };
  
  // Transaction statuses
  export const TRANSACTION_STATUSES = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  };
  
  // Referral statuses
  export const REFERRAL_STATUSES = {
    PENDING: 'pending',
    ACTIVE: 'active',
    REWARDED: 'rewarded',
  };
  
  // Minimum withdrawal amount
  export const MIN_WITHDRAWAL_AMOUNT = 10;
  
  // Referral commission rate (10%)
  export const REFERRAL_COMMISSION_RATE = 0.1;