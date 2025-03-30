// config/jwt.js
const config = require('./environment');

module.exports = {
  secret: config.jwt.secret,
  expiresIn: config.jwt.expiresIn || '7d',
  options: {
    issuer: 'crypto-profit-app',
    audience: 'crypto-profit-app-users'
  }
};