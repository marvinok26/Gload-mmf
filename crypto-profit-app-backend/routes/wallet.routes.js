// routes/wallet.routes.js
const walletController = require('../controllers/wallet.controller');
const authMiddleware = require('../middleware/auth.middleware');

async function routes(fastify, options) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware.authenticate);

  // Get deposit address
  fastify.get('/api/wallet/address', walletController.getDepositAddress);

  // Get wallet balance
  fastify.get('/api/wallet/balance', walletController.getBalance);

  // Request withdrawal
  fastify.post('/api/wallet/withdraw', {
    schema: {
      body: {
        type: 'object',
        required: ['amount', 'address'],
        properties: {
          amount: { type: 'number', minimum: 0.01 },
          address: { type: 'string', minLength: 10 }
        }
      }
    }
  }, walletController.requestWithdrawal);

  // Get deposit history
  fastify.get('/api/wallet/deposits', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      }
    }
  }, walletController.getDepositHistory);

  // Get withdrawal history
  fastify.get('/api/wallet/withdrawals', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      }
    }
  }, walletController.getWithdrawalHistory);
}

module.exports = routes;