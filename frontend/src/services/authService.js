import api from '../utils/api';

// Auth services
const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  
  updateProfile: async (userId, userData) => {
    return api.put(`/users/profile/${userId}`, userData);
  },
  
  updatePassword: async (currentPassword, newPassword) => {
    return api.put('/auth/password', { currentPassword, newPassword });
  }
};

export default authService;
