// src/services/miner.service.js
import api from './api.service';

// Get available miners
export const getAvailableMiners = async () => {
  try {
    const response = await api.get('/api/miners');
    return response;
  } catch (error) {
    console.error('Get available miners error:', error);
    return { success: false, message: error.message || 'Failed to get available miners' };
  }
};

// Get user miners
export const getUserMiners = async () => {
  try {
    const response = await api.get('/api/user/miners');
    return response;
  } catch (error) {
    console.error('Get user miners error:', error);
    return { success: false, message: error.message || 'Failed to get your miners' };
  }
};

// Purchase a miner
export const purchaseMiner = async (minerId, amount) => {
  try {
    const response = await api.post('/api/miners/purchase', { minerId, amount });
    return response;
  } catch (error) {
    console.error('Purchase miner error:', error);
    return { success: false, message: error.message || 'Failed to purchase miner' };
  }
};

// Activate/deactivate miner
export const toggleMinerStatus = async (userMinerId, active) => {
  try {
    const response = await api.put('/api/user/miners/toggle', { userMinerId, active });
    return response;
  } catch (error) {
    console.error('Toggle miner status error:', error);
    return { success: false, message: error.message || 'Failed to update miner status' };
  }
};