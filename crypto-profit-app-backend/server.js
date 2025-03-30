// server.js - Main entry point for the application
require('dotenv').config();
const fastify = require('fastify')({ 
  logger: true,
  trustProxy: true
});
const path = require('path');
const connectDB = require('./config/database');
const { registerErrorHandlers } = require('./middleware/error.middleware');
const { Miner, initializeMiners } = require('./models/miner.model');
const config = require('./config/environment');

// Register content type parsers
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    const json = JSON.parse(body);
    req.rawBody = body; // Keep raw body for HMAC verification
    done(null, json);
  } catch (err) {
    err.statusCode = 400;
    done(err, undefined);
  }
});

// Register plugins
fastify.register(require('fastify-cors'), {
  origin: '*', // In production, restrict to your domains
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
});

fastify.register(require('fastify-jwt'), {
  secret: config.jwt.secret
});

// Register routes
fastify.register(require('./routes/auth.routes'));
fastify.register(require('./routes/user.routes'));
fastify.register(require('./routes/wallet.routes'));
fastify.register(require('./routes/miner.routes'));
fastify.register(require('./routes/referral.routes'));

// Register webhooks
fastify.register(require('./webhooks/crypto-payment.webhook'));

// Register error handlers
registerErrorHandlers(fastify);

// Root route
fastify.get('/', async (request, reply) => {
  return { 
    app: config.app.name,
    version: '1.0.0',
    status: 'online'
  };
});

// Health check route
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'ok',
    timestamp: new Date()
  };
});

// Start the server
const start = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize default miners if needed
    await initializeMiners();
    
    // Start server
    await fastify.listen({ 
      port: config.app.port,
      host: '0.0.0.0'
    });
    
    console.log(`Server is running on port ${config.app.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// Start the server
start();