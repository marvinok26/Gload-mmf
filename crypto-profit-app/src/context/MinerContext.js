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
  
  // Load miners when user is authenticated
  useEffect(() => {
    if (user && token) {
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
    if (!user || !token) return;
    
    setLoading(true);
    try {
      const response = await minerService.getAvailableMiners();
      
      if (response.success) {
        setMiners(response.miners);
      } else {
        setError(response.message || 'Failed to load miners');
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
    if (!user || !token) return;
    
    setLoading(true);
    try {
      const response = await minerService.getUserMiners();
      
      if (response.success) {
        setUserMiners(response.miners);
      } else {
        setError(response.message || 'Failed to load your miners');
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
    if (!user || !token) return { success: false, error: 'Not authenticated' };
    
    if (!minerId) {
      return { success: false, error: 'Miner ID is required' };
    }
    
    if (!amount || amount <= 0) {
      return { success: false, error: 'Invalid purchase amount' };
    }
    
    setLoading(true);
    try {
      const response = await minerService.purchaseMiner(minerId, amount);
      
      if (response.success) {
        // Refresh user data to update balance
        await refreshUserData();
        // Refresh user miners
        await loadUserMiners();
        
        return { success: true, miner: response.miner };
      } else {
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
    if (!user || !token) return { success: false, error: 'Not authenticated' };
    
    if (!userMinerId) {
      return { success: false, error: 'Miner ID is required' };
    }
    
    setLoading(true);
    try {
      const response = await minerService.toggleMinerStatus(userMinerId, active);
      
      if (response.success) {
        // Refresh user miners
        await loadUserMiners();
        
        return { success: true };
      } else {
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