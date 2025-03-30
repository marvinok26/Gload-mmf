// config/crypto.js
const config = require('./environment');

module.exports = {
  coinpayments: {
    apiKey: config.crypto.coinpayments.apiKey,
    apiSecret: config.crypto.coinpayments.apiSecret,
    merchantId: config.crypto.coinpayments.merchantId,
    ipnSecret: config.crypto.coinpayments.ipnSecret,
    apiUrl: 'https://www.coinpayments.net/api.php',
    ipnUrl: `${config.app.apiUrl}/webhooks/crypto-payment`,
    currency: config.crypto.coinpayments.currency || 'USDT.TRC20',
    depositConfirmations: config.crypto.coinpayments.depositConfirmations || 1
  },
  
  getCallbackUrl: (userId) => {
    return `${config.app.apiUrl}/webhooks/crypto-payment?userId=${userId}`;
  }
};