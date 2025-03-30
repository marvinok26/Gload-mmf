// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/user.model');

/**
 * Authenticate JWT token middleware
 */
const authenticate = async (req, reply) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ 
        success: false, 
        message: 'Authentication token is missing or invalid' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return reply.status(401).send({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }
    
    // Set user in request object
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name
    };
    
    return;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return reply.status(401).send({ 
        success: false, 
        message: 'Invalid authentication token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return reply.status(401).send({ 
        success: false, 
        message: 'Authentication token has expired' 
      });
    }
    
    console.error('Authentication error:', error);
    return reply.status(500).send({ 
      success: false, 
      message: 'An error occurred during authentication' 
    });
  }
};

/**
 * Admin authentication middleware
 */
const authenticateAdmin = async (req, reply) => {
  try {
    // First run normal authentication
    await authenticate(req, reply);
    
    // If reply was already sent (authentication failed), return
    if (reply.sent) return;
    
    // Check if user is admin
    const user = await User.findById(req.user.id);
    
    if (!user || !user.isAdmin) {
      return reply.status(403).send({ 
        success: false, 
        message: 'Unauthorized access' 
      });
    }
    
    return;
  } catch (error) {
    console.error('Admin authentication error:', error);
    return reply.status(500).send({ 
      success: false, 
      message: 'An error occurred during admin authentication' 
    });
  }
};

module.exports = {
  authenticate,
  authenticateAdmin
};