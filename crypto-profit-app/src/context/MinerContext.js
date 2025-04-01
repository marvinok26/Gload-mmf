// src/context/MinerContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import * as minerService from '../services/miner.service';

// Create the context
export const MinerContext = createContext();

export const MinerProvider = ({ children }) => {
  const { user, token, refreshUserData } = useContext(AuthContext);
  const [miners, setMiners] = useState([]);
  const [userMiners, setUserMiners] = useState([]);
  const [totalMiningPower, setTotalMiningPower] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debug logs for initialization
  useEffect(() => {
    console.log('MinerContext initialized');
    console.log('User authenticated:', !!user);
    console.log('Token available:', !!token);
  }, []);
  
  // Load miners when user is authenticated
  useEffect(() => {
    console.log('Auth state changed, user:', !!user, 'token:', !!token);
    
    if (user && token) {
      loadMiners();
      loadUserMiners();
    } else {
      // For development only - load miners even without auth
      // Remove this in production
      console.log('DEV MODE: Loading miners without auth');
      loadMiners();
      loadUserMiners();
    }
  }, [user, token]);
  
  // Calculate total mining power when userMiners changes
  useEffect(() => {
    if (userMiners && userMiners.length > 0) {
      const power = userMiners.reduce((total, miner) => {
        if (miner.isActive) {
          return total + (miner.purchaseAmount * miner.profitRate);
        }
        return total;
      }, 0);
      
      setTotalMiningPower(power);
    } else {
      setTotalMiningPower(0);
    }
  }, [userMiners]);
  
  // Get available miners
  const loadMiners = async () => {
    console.log('Loading miners...');
    setLoading(true);
    try {
      const response = await minerService.getAvailableMiners();
      console.log('Miners response:', response);
      
      if (response.success) {
        setMiners(response.miners);
        console.log(`Loaded ${response.miners.length} miners`);
      } else {
        console.error('Failed to load miners:', response.message);
        setError(response.message || 'Failed to load miners');
        
        // Alert only in development
        if (__DEV__) {
          Alert.alert('Dev Error', `Failed to load miners: ${response.message}`);
        }
      }
    } catch (error) {
      console.error('Error loading miners:', error);
      setError('Failed to load miners');
    } finally {
      setLoading(false);
    }
  };
  
  // Get user's miners
  const loadUserMiners = async () => {
    console.log('Loading user miners...');
    setLoading(true);
    try {
      const response = await minerService.getUserMiners();
      console.log('User miners response:', response);
      
      if (response.success) {
        setUserMiners(response.miners);
        console.log(`Loaded ${response.miners.length} user miners`);
      } else {
        console.error('Failed to load user miners:', response.message);
        setError(response.message || 'Failed to load your miners');
        
        // Alert only in development
        if (__DEV__) {
          Alert.alert('Dev Error', `Failed to load user miners: ${response.message}`);
        }
      }
    } catch (error) {
      console.error('Error loading user miners:', error);
      setError('Failed to load your miners');
    } finally {
      setLoading(false);
    }
  };
  
  // Purchase a miner
  const purchaseMiner = async (minerId, amount) => {
    console.log(`Purchasing miner ${minerId} for ${amount}...`);
    
    // For development, allow without auth
    if (!user && !token && !__DEV__) {
      return { success: false, error: 'Not authenticated' };
    }
    
    if (!minerId) {
      return { success: false, error: 'Miner ID is required' };
    }
    
    if (!amount || amount <= 0) {
      return { success: false, error: 'Invalid purchase amount' };
    }
    
    setLoading(true);
    try {
      const response = await minerService.purchaseMiner(minerId, amount);
      console.log('Purchase response:', response);
      
      if (response.success) {
        // Refresh user data to update balance
        if (refreshUserData) {
          await refreshUserData();
        }
        
        // Refresh user miners
        await loadUserMiners();
        
        return { success: true, miner: response.miner };
      } else {
        console.error('Miner purchase failed:', response.message);
        setError(response.message || 'Miner purchase failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error purchasing miner:', error);
      setError('Miner purchase failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Activate/deactivate a miner
  const toggleMinerStatus = async (userMinerId, active) => {
    console.log(`Toggling miner ${userMinerId} to ${active ? 'active' : 'inactive'}...`);
    
    // For development, allow without auth
    if (!user && !token && !__DEV__) {
      return { success: false, error: 'Not authenticated' };
    }
    
    if (!userMinerId) {
      return { success: false, error: 'Miner ID is required' };
    }
    
    setLoading(true);
    try {
      const response = await minerService.toggleMinerStatus(userMinerId, active);
      console.log('Toggle response:', response);
      
      if (response.success) {
        // Refresh user miners
        await loadUserMiners();
        
        return { success: true };
      } else {
        console.error('Failed to update miner status:', response.message);
        setError(response.message || 'Failed to update miner status');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error toggling miner status:', error);
      setError('Failed to update miner status');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Get daily profit preview
  const getDailyProfitPreview = () => {
    if (!userMiners || userMiners.length === 0) {
      return 0;
    }
    
    return userMiners.reduce((total, miner) => {
      if (miner.isActive) {
        return total + miner.dailyProfit;
      }
      return total;
    }, 0);
  };
  
  return (
    <MinerContext.Provider
      value={{
        miners,
        userMiners,
        totalMiningPower,
        loading,
        error,
        loadMiners,
        loadUserMiners,
        purchaseMiner,
        toggleMinerStatus,
        getDailyProfitPreview,
        activeMiners: userMiners ? userMiners.filter(m => m.isActive) : [],
      }}
    >
      {children}
    </MinerContext.Provider>
  );
};