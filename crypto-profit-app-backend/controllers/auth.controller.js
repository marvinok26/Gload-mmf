// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Referral = require('../models/referral.model');
const jwtConfig = require('../config/jwt');
const cryptoService = require('../services/crypto.service');
const notificationService = require('../services/notification.service');

/**
 * Register a new user
 */
const register = async (req, reply) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.code(400).send({ 
        success: false, 
        message: 'Email is already registered' 
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password
    });

    // If referral code is provided, handle referral
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      
      if (referrer) {
        newUser.referredBy = referrer._id;
      }
    }

    // Save user to database
    await newUser.save();

    // Generate deposit address
    try {
      await cryptoService.generateDepositAddress(newUser._id);
      
      // Refresh user data to get deposit address
      const updatedUser = await User.findById(newUser._id);
      
      // If referral code was valid, create referral record
      if (newUser.referredBy) {
        const newReferral = new Referral({
          referrerId: newUser.referredBy,
          referredId: newUser._id,
          status: 'active'
        });
        
        await newReferral.save();
      }
      
      // Send welcome email (only in production)
      if (process.env.NODE_ENV === 'production') {
        await notificationService.sendWelcomeEmail(updatedUser);
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: updatedUser._id },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );
      
      // Return user data (without sensitive info) and token
      return reply.code(201).send({
        success: true,
        message: 'User registered successfully',
        token,
        user: updatedUser.toSafeObject()
      });
    } catch (error) {
      console.error('Error generating deposit address:', error);
      
      // Even if deposit address generation fails, the user is still created
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );
      
      return reply.code(201).send({
        success: true,
        message: 'User registered successfully, but deposit address could not be generated. Please try logging in again.',
        token,
        user: newUser.toSafeObject()
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return reply.code(500).send({ 
      success: false, 
      message: 'An error occurred during registration' 
    });
  }
};

/**
 * Login user
 */
const login = async (req, reply) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(401).send({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return reply.code(401).send({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // If user doesn't have a deposit address, generate one
    if (!user.depositAddress) {
      try {
        await cryptoService.generateDepositAddress(user._id);
        // Refresh user data to get deposit address
        const updatedUser = await User.findById(user._id);
        user.depositAddress = updatedUser.depositAddress;
        await user.save();
      } catch (error) {
        console.error('Error generating deposit address during login:', error);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Return user data and token
    return reply.code(200).send({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Login error:', error);
    return reply.code(500).send({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
};

/**
 * Get current user data
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching user data' 
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};