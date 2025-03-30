// routes/referral.routes.js
const referralController = require('../controllers/referral.controller');
const authMiddleware = require('../middleware/auth.middleware');

async function routes(fastify, options) {
  // Validate referral code (no authentication required)
  fastify.get('/api/referrals/validate/:code', referralController.validateReferralCode);

  // Routes requiring authentication
  fastify.register(async function (fastify) {
    // Apply authentication middleware
    fastify.addHook('preHandler', authMiddleware.authenticate);

    // Get user's referral information
    fastify.get('/api/referrals/info', referralController.getReferralInfo);

    // Get user's referrals list
    fastify.get('/api/referrals/list', {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
          }
        }
      }
    }, referralController.getReferralsList);

    // Get referral earnings history
    fastify.get('/api/referrals/earnings', {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
          }
        }
      }
    }, referralController.getReferralEarnings);
  });
}

module.exports = routes;