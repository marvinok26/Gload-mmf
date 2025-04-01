// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api.service';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on app start
  useEffect(() => {
    setInitializing(false);
  }, []);

  // Register user
  const register = async (name, email, password, referralCode = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create request data
      const userData = { name, email, password };
      if (referralCode) {
        userData.referralCode = referralCode;
      }

      // Make API call to register endpoint
      const response = await api.post('/api/auth/register', userData);
      
      if (response.success) {
        // Set user data and token
        setUser(response.user);
        setToken(response.token);
        
        // Set authorization header for future requests
        api.setAuthToken(response.token);
        
        // Navigate to the main app
        router.replace('/(tabs)');
        
        return { success: true };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Make API call to login endpoint
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.success) {
        // Set user data and token
        setUser(response.user);
        setToken(response.token);
        
        // Set authorization header for future requests
        api.setAuthToken(response.token);
        
        // Navigate to the main app
        router.replace('/(tabs)');
        
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      
      // Clear auth header
      api.clearAuthToken();
      
      // Navigate to login screen
      router.replace('/login');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user data
  const refreshUserData = async () => {
    if (!token) return { success: false, error: 'Not authenticated' };
    
    try {
      const response = await api.get('/api/auth/me');
      
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        initializing,
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