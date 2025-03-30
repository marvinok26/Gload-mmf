// config/email.js
const config = require('./environment');

module.exports = {
  service: config.email.service || 'sendgrid',
  apiKey: config.email.apiKey,
  fromAddress: config.email.fromAddress || 'no-reply@cryptoprofitapp.com',
  fromName: config.email.fromName || 'Crypto Profit App',
  
  templates: {
    welcome: 'welcome_template',
    depositConfirmed: 'deposit_confirmed_template',
    withdrawalRequest: 'withdrawal_request_template',
    minerPurchase: 'miner_purchase_template',
    referralCommission: 'referral_commission_template',
    dailyProfit: 'daily_profit_template'
  },
  
  adminEmail: process.env.ADMIN_EMAIL || 'admin@cryptoprofitapp.com'
};