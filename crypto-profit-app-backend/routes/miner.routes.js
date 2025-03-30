// routes/miner.routes.js
const minerController = require('../controllers/miner.controller');
const authMiddleware = require('../middleware/auth.middleware');

async function routes(fastify, options) {
  // Get all miners (no authentication required)
  fastify.get('/api/miners', minerController.getAllMiners);

  // Routes requiring authentication
  fastify.register(async function (fastify) {
    // Apply authentication middleware
    fastify.addHook('preHandler', authMiddleware.authenticate);

    // Get user's miners
    fastify.get('/api/user/miners', minerController.getUserMiners);

    // Purchase a miner
    fastify.post('/api/miners/purchase', {
      schema: {
        body: {
          type: 'object',
          required: ['minerId', 'amount'],
          properties: {
            minerId: { type: 'string' },
            amount: { type: 'number', minimum: 0.01 }
          }
        }
      }
    }, minerController.purchaseMiner);

    // Activate/deactivate user's miner
    fastify.put('/api/user/miners/toggle', {
      schema: {
        body: {
          type: 'object',
          required: ['userMinerId'],
          properties: {
            userMinerId: { type: 'string' },
            active: { type: 'boolean' }
          }
        }
      }
    }, minerController.toggleMinerStatus);
  });
}

module.exports = routes;