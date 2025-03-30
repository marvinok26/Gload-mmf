// routes/user.routes.js
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

async function routes(fastify, options) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware.authenticate);

  // Get user profile
  fastify.get('/api/user/profile', userController.getProfile);

  // Update user profile
  fastify.put('/api/user/profile', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 }
        }
      }
    }
  }, userController.updateProfile);

  // Get user transaction history
  fastify.get('/api/user/transactions', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['deposit', 'withdrawal', 'profit', 'miner_purchase', 'referral'] },
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      }
    }
  }, userController.getTransactionHistory);

  // Get user statistics
  fastify.get('/api/user/stats', userController.getUserStats);

  // Get referral data
  fastify.get('/api/user/referrals', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      }
    }
  }, userController.getReferralData);
}

module.exports = routes;