// src/constants/api.constants.js
// API Base URL - make sure this matches your backend URL
// export const API_BASE_URL = 'http://localhost:5005';
export const API_BASE_URL = 'https://ba26-197-237-133-192.ngrok-free.app';

// Development mode flag - set to true during development to use mock data if API fails
export const DEV_MODE = true;

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

// Mining tiers configuration
export const MINER_TIERS = {
  BASIC: {
    MIN_PRICE: 5,
    MAX_PRICE: 50,
    MIN_PROFIT: 0.02, // 2%
    MAX_PROFIT: 0.40, // 40%
    DURATION_MONTHS: 1
  },
  ADVANCED: {
    MIN_PRICE: 60,
    MAX_PRICE: 100,
    MIN_PROFIT: 0.50, // 50%
    MAX_PROFIT: 0.90, // 90%
    DURATION_MONTHS: 2
  },
  PREMIUM: {
    MIN_PRICE: 110,
    MAX_PRICE: 600,
    MIN_PROFIT: 1.00, // 100%
    MAX_PROFIT: 2.00, // 200%
    DURATION_MONTHS: 3
  }
};

// Calculate profit rate based on price within a tier
const calculateProfitRate = (price, tier) => {
  const { MIN_PRICE, MAX_PRICE, MIN_PROFIT, MAX_PROFIT } = MINER_TIERS[tier];
  // Linear interpolation to determine profit rate
  const priceRatio = (price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE);
  return MIN_PROFIT + priceRatio * (MAX_PROFIT - MIN_PROFIT);
};

// Basic Miner options ($5-$50)
export const BASIC_MINERS = [
  {
    minerId: 'b1',
    name: 'Nano Miner',
    price: 5,
    profitRate: 0.02, // 2% daily
    tier: 'basic',
    description: 'Entry-level miner with 2% daily returns. Lasts for 1 month.'
  },
  {
    minerId: 'b2',
    name: 'Mini Miner',
    price: 10,
    profitRate: 0.10, // 10% daily
    tier: 'basic',
    description: 'Starter miner with 10% daily returns. Lasts for 1 month.'
  },
  {
    minerId: 'b3',
    name: 'Basic Miner',
    price: 20,
    profitRate: 0.18, // 18% daily
    tier: 'basic',
    description: 'Standard basic miner with 18% daily returns. Lasts for 1 month.'
  },
  {
    minerId: 'b4',
    name: 'Standard Miner',
    price: 30,
    profitRate: 0.25, // 25% daily
    tier: 'basic',
    description: 'Enhanced basic miner with 25% daily returns. Lasts for 1 month.'
  },
  {
    minerId: 'b5',
    name: 'Enhanced Miner',
    price: 40,
    profitRate: 0.32, // 32% daily
    tier: 'basic',
    description: 'Advanced basic miner with 32% daily returns. Lasts for 1 month.'
  },
  {
    minerId: 'b6',
    name: 'Pro Miner',
    price: 50,
    profitRate: 0.40, // 40% daily
    tier: 'basic',
    description: 'Professional basic miner with 40% daily returns. Lasts for 1 month.'
  }
];

// Advanced Miners ($60-$100)
export const ADVANCED_MINERS = [
  {
    minerId: 'a1',
    name: 'Advanced Miner I',
    price: 60,
    profitRate: 0.50, // 50% daily
    tier: 'advanced',
    description: 'Entry advanced miner with 50% daily returns. Lasts for 2 months.'
  },
  {
    minerId: 'a2',
    name: 'Advanced Miner II',
    price: 70,
    profitRate: 0.60, // 60% daily
    tier: 'advanced',
    description: 'Standard advanced miner with 60% daily returns. Lasts for 2 months.'
  },
  {
    minerId: 'a3',
    name: 'Advanced Miner III',
    price: 80,
    profitRate: 0.70, // 70% daily
    tier: 'advanced',
    description: 'Enhanced advanced miner with 70% daily returns. Lasts for 2 months.'
  },
  {
    minerId: 'a4',
    name: 'Advanced Miner IV',
    price: 90,
    profitRate: 0.80, // 80% daily
    tier: 'advanced',
    description: 'High-end advanced miner with 80% daily returns. Lasts for 2 months.'
  },
  {
    minerId: 'a5',
    name: 'Advanced Miner Pro',
    price: 100,
    profitRate: 0.90, // 90% daily
    tier: 'advanced',
    description: 'Professional advanced miner with 90% daily returns. Lasts for 2 months.'
  }
];

// Premium Miners ($110-$600)
export const PREMIUM_MINERS = [
  {
    minerId: 'p1',
    name: 'Premium Miner I',
    price: 110,
    profitRate: 1.00, // 100% daily
    tier: 'premium',
    description: 'Entry premium miner with 100% daily returns. Lasts for 3 months.'
  },
  {
    minerId: 'p2',
    name: 'Premium Miner II',
    price: 200,
    profitRate: 1.20, // 120% daily
    tier: 'premium',
    description: 'Standard premium miner with 120% daily returns. Lasts for 3 months.'
  },
  {
    minerId: 'p3',
    name: 'Premium Miner III',
    price: 300,
    profitRate: 1.40, // 140% daily
    tier: 'premium',
    description: 'Enhanced premium miner with 140% daily returns. Lasts for 3 months.'
  },
  {
    minerId: 'p4',
    name: 'Premium Miner IV',
    price: 400,
    profitRate: 1.60, // 160% daily
    tier: 'premium',
    description: 'High-end premium miner with 160% daily returns. Lasts for 3 months.'
  },
  {
    minerId: 'p5',
    name: 'Premium Miner V',
    price: 500,
    profitRate: 1.80, // 180% daily
    tier: 'premium',
    description: 'Professional premium miner with 180% daily returns. Lasts for 3 months.'
  },
  {
    minerId: 'p6',
    name: 'Premium Miner Elite',
    price: 600,
    profitRate: 2.00, // 200% daily
    tier: 'premium',
    description: 'Elite premium miner with 200% daily returns. Lasts for 3 months.'
  }
];

// Combine all miners for use in mock data
export const MOCK_MINERS = [
  ...BASIC_MINERS,
  ...ADVANCED_MINERS,
  ...PREMIUM_MINERS
];