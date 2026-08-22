import api, { handleApiError } from './api';
import { MOCK_USERS } from '../data/mockUsers';

export const authService = {
  login: async (email, password) => {
    try {
      // Future Axios implementation:
      // const response = await api.post('/auth/login', { email, password });
      // return response.data;

      // Mock implementation ready for swap:
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const foundUser = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );

          if (foundUser) {
            const userResponse = { ...foundUser };
            delete userResponse.password;
            resolve({
              user: userResponse,
              token: `dayflow_jwt_mock_${userResponse.role}_${Date.now()}`,
            });
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Login failed'));
    }
  },

  register: async (userData) => {
    try {
      // Future Axios implementation:
      // const response = await api.post('/auth/register', userData);
      // return response.data;

      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            id: userData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
            employeeId: userData.employeeId,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role || 'employee',
            title: userData.role === 'admin' ? 'HR Director' : 'Software Engineer',
            department: userData.role === 'admin' ? 'Human Resources' : 'Engineering',
          };

          resolve({
            user: newUser,
            token: `dayflow_jwt_mock_${newUser.role}_${Date.now()}`,
          });
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Registration failed'));
    }
  },

  logout: async () => {
    try {
      // Future Axios implementation:
      // await api.post('/auth/logout');
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(true);
    }
  },

  getCurrentUser: async (token) => {
    try {
      // Future Axios implementation:
      // const response = await api.get('/auth/me');
      // return response.data;

      return new Promise((resolve) => {
        if (!token) return resolve(null);
        const savedUser = localStorage.getItem('dayflow_user');
        if (savedUser) {
          try {
            return resolve(JSON.parse(savedUser));
          } catch (e) {
            // fallback
          }
        }
        const isAdmin = token.includes('admin');
        const mockUser = isAdmin ? MOCK_USERS[1] : MOCK_USERS[0];
        const userResponse = { ...mockUser };
        delete userResponse.password;
        resolve(userResponse);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user profile'));
    }
  },
};
