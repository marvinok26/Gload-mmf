// src/constants/api.constants.js

// API Base URL - update this to your backend URL
// export const API_BASE_URL = 'http://localhost:3000';
export const API_BASE_URL = 'https://5cb7-41-90-65-251.ngrok-free.app'


// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  CURRENT_USER: '/api/auth/me',
  
  // User
  USER_PROFILE: '/api/user/profile',
  USER_TRANSACTIONS: '/api/user/transactions',
  USER_STATS: '/api/user/stats',
  USER_REFERRALS: '/api/user/referrals',
  
  // Wallet
  WALLET_ADDRESS: '/api/wallet/address',
  WALLET_BALANCE: '/api/wallet/balance',
  WALLET_WITHDRAW: '/api/wallet/withdraw',
  WALLET_DEPOSITS: '/api/wallet/deposits',
  WALLET_WITHDRAWALS: '/api/wallet/withdrawals',
  
  // Miners
  MINERS: '/api/miners',
  USER_MINERS: '/api/user/miners',
  PURCHASE_MINER: '/api/miners/purchase',
  TOGGLE_MINER: '/api/user/miners/toggle',
  
  // Referrals
  REFERRAL_INFO: '/api/referrals/info',
  REFERRAL_LIST: '/api/referrals/list',
  REFERRAL_EARNINGS: '/api/referrals/earnings',
  VALIDATE_REFERRAL: '/api/referrals/validate',
};