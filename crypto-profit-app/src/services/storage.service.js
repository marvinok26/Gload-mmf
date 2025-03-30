// src/services/storage.service.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
export const storeData = async (key, value) => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
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
    if (jsonValue === null) return null;
    
    try {
      return JSON.parse(jsonValue);
    } catch {
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
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};