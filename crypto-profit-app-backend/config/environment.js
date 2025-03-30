// config/environment.js
require('dotenv').config();

module.exports = {
  app: {
    name: 'Crypto Profit App',
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:19006',
  },
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto_profit_app',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-for-development',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  crypto: {
    coinpayments: {
      apiKey: process.env.COINPAYMENTS_API_KEY,
      apiSecret: process.env.COINPAYMENTS_API_SECRET,
      merchantId: process.env.COINPAYMENTS_MERCHANT_ID,
      ipnSecret: process.env.COINPAYMENTS_IPN_SECRET,
      currency: 'USDT.TRC20',
      depositConfirmations: 1, // Number of confirmations required for deposit
    }
  },
  
  email: {
    service: process.env.EMAIL_SERVICE || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY,
    fromAddress: process.env.EMAIL_FROM || 'no-reply@cryptoprofitapp.com',
    fromName: process.env.EMAIL_NAME || 'Crypto Profit App',
  },
  
  profit: {
    defaultRate: 0.05, // 5% daily profit by default
    calculationTime: '00:00', // Midnight UTC
  },
  
  referral: {
    commissionRate: 0.1, // 10% commission on referral's first miner purchase
  },
  
  miners: {
    types: [
      {
        id: 'basic-miner',
        name: 'Basic Miner',
        price: 50,
        profitRate: 0.05, // 5% daily
        description: 'Entry-level miner with 5% daily returns',
        imageUrl: '/images/basic-miner.png'
      },
      {
        id: 'advanced-miner',
        name: 'Advanced Miner',
        price: 200,
        profitRate: 0.07, // 7% daily
        description: 'Intermediate miner with 7% daily returns',
        imageUrl: '/images/advanced-miner.png'
      },
      {
        id: 'premium-miner',
        name: 'Premium Miner',
        price: 500,
        profitRate: 0.1, // 10% daily
        description: 'Premium miner with 10% daily returns',
        imageUrl: '/images/premium-miner.png'
      }
    ]
  }
};