// src/services/miner.service.js
import api from './api.service';
import { API_ENDPOINTS, DEV_MODE, MOCK_MINERS } from '../constants/api.constants';
import { storeData, getData } from './storage.service';

// Storage keys for miner activation times
const ACTIVATION_TIMES_KEY = 'miner_activation_times';

// Helper function to add tier information if missing
const addTierInfo = (miner) => {
  if (!miner.tier) {
    if (miner.price >= 110) {
      miner.tier = 'premium';
    } else if (miner.price >= 60) {
      miner.tier = 'advanced';
    } else {
      miner.tier = 'basic';
    }
  }
  return miner;
};

// Get tier duration in months
const getTierDuration = (tier) => {
  if (tier === 'premium') return 3;
  if (tier === 'advanced') return 2;
  return 1; // basic
};

// Get available miners
export const getAvailableMiners = async () => {
  try {
    console.log('Getting available miners...');
    const response = await api.get(API_ENDPOINTS.MINERS);
    console.log('Miners response:', response);
    
    if (response.success && response.miners) {
      // Add tier information if not present
      const minersWithTiers = response.miners.map(addTierInfo);
      return { success: true, miners: minersWithTiers };
    } else {
      if (DEV_MODE) {
        console.log('Using mock miners data for development');
        return { success: true, miners: MOCK_MINERS };
      }
      return response;
    }
  } catch (error) {
    console.error('Get available miners error:', error);
    if (DEV_MODE) {
      console.log('Using mock miners data for development due to error');
      return { success: true, miners: MOCK_MINERS };
    }
    return { success: false, message: error.message || 'Failed to get available miners' };
  }
};

// Get user miners
export const getUserMiners = async () => {
  try {
    console.log('Getting user miners...');
    const response = await api.get(API_ENDPOINTS.USER_MINERS);
    console.log('User miners response:', response);
    
    if (response.success && response.miners) {
      // Add activation progress information
      const minerProgress = await getMinersActivationProgress();
      
      const minersWithProgress = response.miners.map(miner => ({
        ...miner,
        activationProgress: minerProgress[miner.id] || 0,
        activationTime: getActivationTime(miner.id)
      }));
      
      return { success: true, miners: minersWithProgress };
    } else {
      if (DEV_MODE) {
        console.log('Using mock user miners data for development');
        const mockUserMiners = [
          {
            id: 'um1',
            minerId: 'b2',
            name: 'Mini Miner',
            price: 15,
            profitRate: 0.10,
            dailyProfit: 1.5,
            isActive: true,
            purchaseAmount: 15
          },
          {
            id: 'um2',
            minerId: 'a1',
            name: 'Advanced Miner I',
            price: 60,
            profitRate: 0.50,
            dailyProfit: 30,
            isActive: false,
            purchaseAmount: 60
          }
        ];
        
        // Add activation progress information
        const minerProgress = await getMinersActivationProgress();
        
        const minersWithProgress = mockUserMiners.map(miner => ({
          ...miner,
          activationProgress: minerProgress[miner.id] || 0,
          activationTime: getActivationTime(miner.id)
        }));
        
        return { success: true, miners: minersWithProgress };
      }
      return response;
    }
  } catch (error) {
    console.error('Get user miners error:', error);
    if (DEV_MODE) {
      console.log('Using mock user miners data for development due to error');
      const mockUserMiners = [
        {
          id: 'um1',
          minerId: 'b2',
          name: 'Mini Miner',
          price: 15,
          profitRate: 0.10,
          dailyProfit: 1.5,
          isActive: true,
          purchaseAmount: 15
        },
        {
          id: 'um2',
          minerId: 'a1',
          name: 'Advanced Miner I',
          price: 60,
          profitRate: 0.50,
          dailyProfit: 30,
          isActive: false,
          purchaseAmount: 60
        }
      ];
      
      // Add activation progress information
      const minerProgress = await getMinersActivationProgress();
      
      const minersWithProgress = mockUserMiners.map(miner => ({
        ...miner,
        activationProgress: minerProgress[miner.id] || 0,
        activationTime: getActivationTime(miner.id)
      }));
      
      return { success: true, miners: minersWithProgress };
    }
    return { success: false, message: error.message || 'Failed to get your miners' };
  }
};

// Purchase a miner
export const purchaseMiner = async (minerId, amount) => {
  try {
    console.log(`Purchasing miner ${minerId} for ${amount}...`);
    const response = await api.post(API_ENDPOINTS.PURCHASE_MINER, { minerId, amount });
    console.log('Purchase response:', response);
    return response;
  } catch (error) {
    console.error('Purchase miner error:', error);
    return { success: false, message: error.message || 'Failed to purchase miner' };
  }
};

// Activate/deactivate miner
export const toggleMinerStatus = async (userMinerId, active) => {
  try {
    console.log(`Toggling miner ${userMinerId} to ${active ? 'active' : 'inactive'}...`);
    const response = await api.put(API_ENDPOINTS.TOGGLE_MINER, { userMinerId, active });
    console.log('Toggle response:', response);
    
    if (response.success && active) {
      // Record activation time for progress tracking
      await recordMinerActivation(userMinerId);
    }
    
    return response;
  } catch (error) {
    console.error('Toggle miner status error:', error);
    return { success: false, message: error.message || 'Failed to update miner status' };
  }
};

// Perform daily activation (for 24-hour cycle)
export const activateMinerDaily = async (userMinerId) => {
  try {
    console.log(`Performing daily activation for miner ${userMinerId}...`);
    
    // Try to use the dedicated endpoint if available
    try {
      const response = await api.post(API_ENDPOINTS.DAILY_ACTIVATION, { userMinerId });
      console.log('Daily activation response:', response);
      
      if (response.success) {
        // Reset activation time
        await recordMinerActivation(userMinerId);
        return response;
      }
    } catch (error) {
      console.log('Daily activation endpoint not available, using toggle instead');
      // Fallback to toggle endpoint
    }
    
    // Fallback: Use toggle endpoint to reactivate
    const toggleResponse = await api.put(API_ENDPOINTS.TOGGLE_MINER, { 
      userMinerId, 
      active: true 
    });
    
    if (toggleResponse.success) {
      // Reset activation time
      await recordMinerActivation(userMinerId);
    }
    
    return toggleResponse;
  } catch (error) {
    console.error('Daily activation error:', error);
    return { success: false, message: error.message || 'Failed to activate miner for the day' };
  }
};

// Record miner activation time
const recordMinerActivation = async (minerId) => {
  try {
    // Get current activation times
    const activationTimes = await getData(ACTIVATION_TIMES_KEY) || {};
    
    // Update activation time for this miner
    activationTimes[minerId] = Date.now();
    
    // Save updated times
    await storeData(ACTIVATION_TIMES_KEY, activationTimes);
    
    console.log(`Recorded activation time for miner ${minerId}`);
    return true;
  } catch (error) {
    console.error('Error recording miner activation:', error);
    return false;
  }
};

// Get activation time for a miner
const getActivationTime = (minerId) => {
  try {
    const activationTimes = getData(ACTIVATION_TIMES_KEY) || {};
    return activationTimes[minerId] || null;
  } catch (error) {
    console.error('Error getting activation time:', error);
    return null;
  }
};

// Get activation progress for all miners (0-1 scale)
export const getMinersActivationProgress = async () => {
  try {
    // Get activation times
    const activationTimes = await getData(ACTIVATION_TIMES_KEY) || {};
    const progress = {};
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Calculate progress for each miner
    Object.keys(activationTimes).forEach(minerId => {
      const activationTime = activationTimes[minerId];
      const elapsed = now - activationTime;
      
      // Progress is between 0 and 1
      progress[minerId] = Math.min(elapsed / dayInMs, 1);
    });
    
    return progress;
  } catch (error) {
    console.error('Error calculating miner progress:', error);
    return {};
  }
};

// Check if a miner is ready for daily activation
export const isMinerReadyForActivation = async (minerId) => {
  try {
    const activationTimes = await getData(ACTIVATION_TIMES_KEY) || {};
    const activationTime = activationTimes[minerId];
    
    if (!activationTime) return false;
    
    const elapsed = Date.now() - activationTime;
    const dayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Ready if 24 hours have passed
    return elapsed >= dayInMs;
  } catch (error) {
    console.error('Error checking miner activation readiness:', error);
    return false;
  }
};