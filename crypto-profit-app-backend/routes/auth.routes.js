// routes/auth.routes.js
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

async function routes(fastify, options) {
  // Register a new user
  fastify.post('/api/auth/register', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          referralCode: { type: 'string' }
        }
      }
    }
  }, authController.register);

  // Login user
  fastify.post('/api/auth/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, authController.login);

  // Get current user data
  fastify.get('/api/auth/me', { 
    preHandler: authMiddleware.authenticate 
  }, authController.getCurrentUser);
}

module.exports = routes;