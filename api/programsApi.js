import apiClient from './apiClient';

const programsApi = {
  // Get user's purchased programs
  getPurchasedPrograms: async () => {
    try {
      const response = await apiClient.get('/programs/user/purchased');
      return response;
    } catch (error) {
      console.error('Error fetching purchased programs:', error);
      throw error;
    }
  },

  // Get program details by ID
  getProgramById: async (programId) => {
    try {
      const response = await apiClient.get(`/programs/${programId}`);
      return response;
    } catch (error) {
      console.error('Error fetching program details:', error);
      throw error;
    }
  },

  // Purchase a program
  purchaseProgram: async (programId) => {
    try {
      const response = await apiClient.post('/programs/purchase', { programId });
      return response;
    } catch (error) {
      console.error('Error purchasing program:', error);
      throw error;
    }
  }
};

export default programsApi; 