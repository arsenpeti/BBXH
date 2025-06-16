import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from './baseUrl';

// Create an API client with authentication
const apiClient = {
  // Get the authentication token
  getAuthToken: async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Make an authenticated request
  request: async (endpoint, options = {}) => {
    try {
      const token = await apiClient.getAuthToken();
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          // Clear stored credentials
          await AsyncStorage.multiRemove(['authToken', 'userData']);
          // You might want to redirect to login here
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  // Helper methods for common HTTP methods
  get: (endpoint, options = {}) => {
    return apiClient.request(endpoint, { ...options, method: 'GET' });
  },

  post: (endpoint, body, options = {}) => {
    return apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put: (endpoint, body, options = {}) => {
    return apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete: (endpoint, options = {}) => {
    return apiClient.request(endpoint, { ...options, method: 'DELETE' });
  },
};

export default apiClient; 