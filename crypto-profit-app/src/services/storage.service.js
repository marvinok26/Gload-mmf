// src/services/storage.service.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@crypto_app_auth_token',
  USER_DATA: '@crypto_app_user_data',
  USER_SETTINGS: '@crypto_app_user_settings',
  MINERS_DATA: '@crypto_app_miners_data',
  USER_MINERS: '@crypto_app_user_miners',
  LAST_SYNC: '@crypto_app_last_sync'
};

// Store data
export const storeData = async (key, value) => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Data stored for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    return false;
  }
};

// Get data
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      console.log(`No data found for key: ${key}`);
      return null;
    }
    
    try {
      const parsedValue = JSON.parse(jsonValue);
      console.log(`Data retrieved for key: ${key}`);
      return parsedValue;
    } catch {
      console.log(`String data retrieved for key: ${key}`);
      return jsonValue; // Return as string if not valid JSON
    }
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

// Remove data
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data removed for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};

// Clear all data
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared from storage');
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// Store auth token
export const storeAuthToken = async (token) => {
  return await storeData(STORAGE_KEYS.AUTH_TOKEN, token);
};

// Get auth token
export const getAuthToken = async () => {
  return await getData(STORAGE_KEYS.AUTH_TOKEN);
};

// Remove auth token
export const removeAuthToken = async () => {
  return await removeData(STORAGE_KEYS.AUTH_TOKEN);
};

// Store user data
export const storeUserData = async (userData) => {
  return await storeData(STORAGE_KEYS.USER_DATA, userData);
};

// Get user data
export const getUserData = async () => {
  return await getData(STORAGE_KEYS.USER_DATA);
};

// Store miners data (available miners)
export const storeMinersData = async (minersData) => {
  return await storeData(STORAGE_KEYS.MINERS_DATA, minersData);
};

// Get miners data
export const getMinersData = async () => {
  return await getData(STORAGE_KEYS.MINERS_DATA);
};

// Store user miners
export const storeUserMiners = async (userMiners) => {
  return await storeData(STORAGE_KEYS.USER_MINERS, userMiners);
};

// Get user miners
export const getUserMiners = async () => {
  return await getData(STORAGE_KEYS.USER_MINERS);
};

// Store last sync timestamp
export const storeLastSync = async () => {
  return await storeData(STORAGE_KEYS.LAST_SYNC, Date.now());
};

// Get last sync timestamp
export const getLastSync = async () => {
  return await getData(STORAGE_KEYS.LAST_SYNC);
};

// Clear auth data (for logout)
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA
    ]);
    console.log('Auth data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

export default {
  storeData,
  getData,
  removeData,
  clearAll,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  storeUserData,
  getUserData,
  storeMinersData,
  getMinersData,
  storeUserMiners,
  getUserMiners,
  storeLastSync,
  getLastSync,
  clearAuthData,
  STORAGE_KEYS
};