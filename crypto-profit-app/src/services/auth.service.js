// src/services/auth.service.js
import api from './api.service';

// Register a new user
export const register = async (name, email, password, referralCode = null) => {
  try {
    const data = { name, email, password };
    
    if (referralCode) {
      data.referralCode = referralCode;
    }
    
    const response = await api.post('/api/auth/register', data);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: error.message || 'Registration failed' };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'Login failed' };
  }
};

// Get current user data
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, message: error.message || 'Failed to get user data' };
  }
};