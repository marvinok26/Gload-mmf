// src/services/api.service.js
import axios from 'axios';
import { API_BASE_URL } from '../constants/api.constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
      });
    }
    
    // Handle API errors
    console.error('API error:', error.response.data);
    return Promise.reject(error.response.data);
  }
);

// API service
export default {
  // Set auth token for future requests
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
  
  // Clear auth token
  clearAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },
  
  // GET request
  get: async (url, params = {}) => {
    try {
      return await api.get(url, { params });
    } catch (error) {
      throw error;
    }
  },
  
  // POST request
  post: async (url, data = {}) => {
    try {
      return await api.post(url, data);
    } catch (error) {
      throw error;
    }
  },
  
  // PUT request
  put: async (url, data = {}) => {
    try {
      return await api.put(url, data);
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE request
  delete: async (url) => {
    try {
      return await api.delete(url);
    } catch (error) {
      throw error;
    }
  },
};