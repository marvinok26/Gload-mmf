// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import api from '../services/api.service';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register user
  const register = async (name, email, password, referralCode = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // For development, we can mock a successful registration
      const mockUser = {
        id: 'user-1',
        name,
        email,
        balance: 100.0,
        totalProfit: 0,
        referralCode: 'ABC12345',
        depositAddress: 'T' + Math.random().toString(36).substring(2, 15).toUpperCase()
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      // Set state
      setUser(mockUser);
      setToken(mockToken);
      
      // Set auth header
      if (api.setAuthToken) {
        api.setAuthToken(mockToken);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // For development, we can mock a successful login
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email,
        balance: 100.0,
        totalProfit: 25.5,
        referralCode: 'ABC12345',
        depositAddress: 'T' + Math.random().toString(36).substring(2, 15).toUpperCase()
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      // Set state
      setUser(mockUser);
      setToken(mockToken);
      
      // Set auth header
      if (api.setAuthToken) {
        api.setAuthToken(mockToken);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    // Clear state
    setToken(null);
    setUser(null);
    
    // Clear auth header
    if (api.clearAuthToken) {
      api.clearAuthToken();
    }
    
    return { success: true };
  };

  // Update user data
  const refreshUserData = async () => {
    if (!token) return { success: false, error: 'Not authenticated' };
    
    try {
      // For development, we can just return the current user
      return { success: true };
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return { success: false, error: 'Failed to refresh user data' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        register,
        login,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};