// webhooks/crypto-payment.webhook.js
const cryptoService = require('../services/crypto.service');
const notificationService = require('../services/notification.service');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

async function routes(fastify, options) {
  /**
   * CoinPayments IPN (Instant Payment Notification) handler
   * This endpoint will be called by CoinPayments when a payment is received
   */
  fastify.post('/webhooks/crypto-payment', async (request, reply) => {
    try {
      const { userId } = request.query;
      
      if (!userId) {
        return reply.code(400).send({ 
          success: false, 
          message: 'Missing user ID' 
        });
      }
      
      // Get HMAC header for verification
      const hmacHeader = request.headers['hmac'];
      
      // Verify the request is from CoinPayments (in production)
      if (process.env.NODE_ENV === 'production') {
        // Get raw request body for HMAC verification
        const rawBody = request.rawBody || JSON.stringify(request.body);
        
        const isValid = cryptoService.verifyIpnRequest(rawBody, hmacHeader);
        if (!isValid) {
          console.error('Invalid HMAC signature in IPN request');
          return reply.code(403).send({ 
            success: false, 
            message: 'Invalid HMAC signature' 
          });
        }
      }
      
      // Extract payment data from request
      const paymentData = {
        txn_id: request.body.txn_id,
        amount: request.body.amount,
        currency: request.body.currency,
        status: request.body.status,
        address: request.body.address
      };
      
      // Process the deposit
      const result = await cryptoService.processDeposit(userId, paymentData);
      
      // If this is a new completed deposit, send notification
      if (result.created && paymentData.status === '100') {
        const user = await User.findById(userId);
        if (user) {
          await notificationService.sendDepositConfirmationEmail(user, paymentData.amount);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error processing payment webhook:', error);
      return reply.code(500).send({ 
        success: false, 
        message: 'Error processing payment' 
      });
    }
  });
  
  /**
   * Manual deposit confirmation endpoint (for testing)
   * This would not be used in production, but is useful for testing
   */
  fastify.post('/webhooks/test-deposit', async (request, reply) => {
    // Only available in development environment
    if (process.env.NODE_ENV === 'production') {
      return reply.code(403).send({ 
        success: false, 
        message: 'This endpoint is not available in production' 
      });
    }
    
    try {
      const { userId, amount, address, txnId } = request.body;
      
      if (!userId || !amount || !address || !txnId) {
        return reply.code(400).send({ 
          success: false, 
          message: 'Missing required parameters' 
        });
      }
      
      // Process the test deposit
      const paymentData = {
        txn_id: txnId,
        amount: amount,
        currency: 'USDT',
        status: '100', // Completed
        address: address
      };
      
      const result = await cryptoService.processDeposit(userId, paymentData);
      
      // Send notification
      if (result.created) {
        const user = await User.findById(userId);
        if (user) {
          await notificationService.sendDepositConfirmationEmail(user, amount);
        }
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Error processing test deposit:', error);
      return reply.code(500).send({ 
        success: false, 
        message: 'Error processing test deposit' 
      });
    }
  });
}

module.exports = routes;