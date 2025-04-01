// src/services/api.service.js
import { API_BASE_URL, API_ENDPOINTS, DEV_MODE, MOCK_DATA } from '../constants/api.constants';

// Helper to simulate API delay
const simulateDelay = async () => {
  if (MOCK_DATA.ENABLED) {
    const [min, max] = MOCK_DATA.DELAY;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Create API service using fetch
const api = {
  // Set auth token for future requests
  token: null,
  
  // Development mode flag - set to true during development
  devMode: DEV_MODE,
  
  setAuthToken: (token) => {
    if (token) {
      api.token = token;
    }
  },
  
  // Clear auth token
  clearAuthToken: () => {
    api.token = null;
  },
  
  // GET request
  get: async (url, params = {}) => {
    try {
      // Build query string
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      const fullUrl = `${API_BASE_URL}${url}${queryString ? `?${queryString}` : ''}`;
      console.log(`Making GET request to: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(api.token ? { 'Authorization': `Bearer ${api.token}` } : {})
        }
      });
      
      // Get response as text first for debugging
      const textResponse = await response.text();
      
      // Try to parse as JSON
      try {
        const data = JSON.parse(textResponse);
        return data;
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', textResponse.substring(0, 100));
        return { success: false, message: 'Invalid server response' };
      }
    } catch (error) {
      console.error(`GET ${url} error:`, error);
      
      // Use mock data in development mode for specific endpoints
      if (api.devMode && MOCK_DATA.ENABLED) {
        return api.handleMockResponse(url, 'GET', params);
      }
      
      return { success: false, message: error.message || 'Request failed' };
    }
  },
  
  // POST request
  post: async (url, data = {}) => {
    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      console.log(`Making POST request to: ${fullUrl}`, data);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(api.token ? { 'Authorization': `Bearer ${api.token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      // Get response as text first for debugging
      const textResponse = await response.text();
      
      // Try to parse as JSON
      try {
        const responseData = JSON.parse(textResponse);
        return responseData;
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', textResponse.substring(0, 100));
        return { success: false, message: 'Invalid server response' };
      }
    } catch (error) {
      console.error(`POST ${url} error:`, error);
      
      // Use mock data in development mode for specific endpoints
      if (api.devMode && MOCK_DATA.ENABLED) {
        return api.handleMockResponse(url, 'POST', data);
      }
      
      return { success: false, message: error.message || 'Request failed' };
    }
  },
  
  // PUT request
  put: async (url, data = {}) => {
    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      console.log(`Making PUT request to: ${fullUrl}`, data);
      
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(api.token ? { 'Authorization': `Bearer ${api.token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      // Get response as text first for debugging
      const textResponse = await response.text();
      
      // Try to parse as JSON
      try {
        const responseData = JSON.parse(textResponse);
        return responseData;
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', textResponse.substring(0, 100));
        return { success: false, message: 'Invalid server response' };
      }
    } catch (error) {
      console.error(`PUT ${url} error:`, error);
      
      // Use mock data in development mode for specific endpoints
      if (api.devMode && MOCK_DATA.ENABLED) {
        return api.handleMockResponse(url, 'PUT', data);
      }
      
      return { success: false, message: error.message || 'Request failed' };
    }
  },
  
  // DELETE request
  delete: async (url) => {
    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      console.log(`Making DELETE request to: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(api.token ? { 'Authorization': `Bearer ${api.token}` } : {})
        }
      });
      
      // Get response as text first for debugging
      const textResponse = await response.text();
      
      // Try to parse as JSON
      try {
        const data = JSON.parse(textResponse);
        return data;
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', textResponse.substring(0, 100));
        return { success: false, message: 'Invalid server response' };
      }
    } catch (error) {
      console.error(`DELETE ${url} error:`, error);
      
      // Use mock data in development mode for specific endpoints
      if (api.devMode && MOCK_DATA.ENABLED) {
        return api.handleMockResponse(url, 'DELETE', {});
      }
      
      return { success: false, message: error.message || 'Request failed' };
    }
  },
  
  // Function to handle mock responses for development
  handleMockResponse: async (url, method, data) => {
    // Simulate network delay
    await simulateDelay();
    
    // Mock miners data
    if (url === API_ENDPOINTS.MINERS && method === 'GET') {
      return {
        success: true,
        miners: [
          // Basic Miners ($5-$50)
          {
            minerId: 'b1',
            name: 'Nano Miner',
            price: 5,
            profitRate: 0.02, // 2% daily
            tier: 'basic'
          },
          {
            minerId: 'b2',
            name: 'Mini Miner',
            price: 15,
            profitRate: 0.10, // 10% daily
            tier: 'basic'
          },
          {
            minerId: 'b3',
            name: 'Standard Miner',
            price: 30,
            profitRate: 0.25, // 25% daily
            tier: 'basic'
          },
          {
            minerId: 'b4',
            name: 'Pro Miner',
            price: 50,
            profitRate: 0.40, // 40% daily
            tier: 'basic'
          },
          
          // Advanced Miners ($60-$100)
          {
            minerId: 'a1',
            name: 'Advanced Miner I',
            price: 60,
            profitRate: 0.50, // 50% daily
            tier: 'advanced'
          },
          {
            minerId: 'a2',
            name: 'Advanced Miner II',
            price: 75,
            profitRate: 0.65, // 65% daily
            tier: 'advanced'
          },
          {
            minerId: 'a3',
            name: 'Advanced Miner Pro',
            price: 100,
            profitRate: 0.90, // 90% daily
            tier: 'advanced'
          },
          
          // Premium Miners ($110+)
          {
            minerId: 'p1',
            name: 'Premium Miner I',
            price: 110,
            profitRate: 1.00, // 100% daily
            tier: 'premium'
          },
          {
            minerId: 'p2',
            name: 'Premium Miner II',
            price: 200,
            profitRate: 1.50, // 150% daily
            tier: 'premium'
          },
          {
            minerId: 'p3',
            name: 'Premium Miner Elite',
            price: 600,
            profitRate: 2.00, // 200% daily
            tier: 'premium'
          }
        ]
      };
    }
    
    // Mock user miners data
    if (url === API_ENDPOINTS.USER_MINERS && method === 'GET') {
      return {
        success: true,
        miners: [
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
        ]
      };
    }
    
    // Mock purchase miner
    if (url === API_ENDPOINTS.PURCHASE_MINER && method === 'POST') {
      const { minerId, amount } = data;
      
      // Get miner details from mock data
      const mockMiners = [
        // Basic Miners ($5-$50)
        {
          minerId: 'b1',
          name: 'Nano Miner',
          price: 5,
          profitRate: 0.02, // 2% daily
          tier: 'basic'
        },
        {
          minerId: 'b2',
          name: 'Mini Miner',
          price: 15,
          profitRate: 0.10, // 10% daily
          tier: 'basic'
        },
        {
          minerId: 'b3',
          name: 'Standard Miner',
          price: 30,
          profitRate: 0.25, // 25% daily
          tier: 'basic'
        },
        {
          minerId: 'b4',
          name: 'Pro Miner',
          price: 50,
          profitRate: 0.40, // 40% daily
          tier: 'basic'
        },
        
        // Advanced Miners ($60-$100)
        {
          minerId: 'a1',
          name: 'Advanced Miner I',
          price: 60,
          profitRate: 0.50, // 50% daily
          tier: 'advanced'
        },
        {
          minerId: 'a2',
          name: 'Advanced Miner II',
          price: 75,
          profitRate: 0.65, // 65% daily
          tier: 'advanced'
        },
        {
          minerId: 'a3',
          name: 'Advanced Miner Pro',
          price: 100,
          profitRate: 0.90, // 90% daily
          tier: 'advanced'
        },
        
        // Premium Miners ($110+)
        {
          minerId: 'p1',
          name: 'Premium Miner I',
          price: 110,
          profitRate: 1.00, // 100% daily
          tier: 'premium'
        },
        {
          minerId: 'p2',
          name: 'Premium Miner II',
          price: 200,
          profitRate: 1.50, // 150% daily
          tier: 'premium'
        },
        {
          minerId: 'p3',
          name: 'Premium Miner Elite',
          price: 600,
          profitRate: 2.00, // 200% daily
          tier: 'premium'
        }
      ];
      
      const minerInfo = mockMiners.find(m => m.minerId === minerId);
      if (!minerInfo) {
        return { success: false, message: 'Miner not found' };
      }
      
      // Create a new miner instance
      const newMiner = {
        id: `um${Date.now()}`,
        minerId: minerInfo.minerId,
        name: minerInfo.name,
        price: minerInfo.price,
        profitRate: minerInfo.profitRate,
        dailyProfit: minerInfo.price * minerInfo.profitRate,
        isActive: false,
        purchaseAmount: amount || minerInfo.price
      };
      
      return {
        success: true,
        message: 'Miner purchased successfully',
        miner: newMiner
      };
    }
    
    // Mock toggle miner status
    if (url === API_ENDPOINTS.TOGGLE_MINER && method === 'PUT') {
      const { userMinerId, active } = data;
      
      return {
        success: true,
        message: `Miner ${active ? 'activated' : 'deactivated'} successfully`,
        minerId: userMinerId,
        isActive: active
      };
    }
    
    // Mock daily activation
    if (url === API_ENDPOINTS.DAILY_ACTIVATION && method === 'POST') {
      const { userMinerId } = data;
      
      return {
        success: true,
        message: 'Miner activated for another day',
        minerId: userMinerId,
        nextActivation: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
      };
    }
    
    // Mock miner statistics
    if (url === API_ENDPOINTS.MINER_STATISTICS && method === 'GET') {
      return {
        success: true,
        statistics: {
          totalMiners: 2,
          activeMiners: 1,
          totalInvestment: 75, // $15 + $60
          dailyProfit: 1.5, // Only active miner earns profit
          totalProfit: 45, // Example cumulative profit
          mostProfitable: {
            name: 'Advanced Miner I',
            profitRate: 0.50,
            dailyProfit: 30
          }
        }
      };
    }
    
    // Default response for unhandled mock endpoints
    return {
      success: false,
      message: 'This endpoint is not mocked in development mode',
      mockData: { url, method, data }
    };
  }
};

export default api;