import api, { handleApiError } from './api';
import { MOCK_EMPLOYEE_PROFILE } from '../data/employees';

let currentProfile = { ...MOCK_EMPLOYEE_PROFILE };

export const employeeService = {
  getProfile: async () => {
    try {
      // Future Axios: const response = await api.get('/employee/profile'); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => resolve({ ...currentProfile }), 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch employee profile'));
    }
  },

  updateProfile: async (updateData) => {
    try {
      // Future Axios: const response = await api.put('/employee/profile', updateData); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          currentProfile = {
            ...currentProfile,
            phone: updateData.phone !== undefined ? updateData.phone : currentProfile.phone,
            address: updateData.address !== undefined ? updateData.address : currentProfile.address,
            avatar: updateData.avatar !== undefined ? updateData.avatar : currentProfile.avatar,
          };
          resolve({ ...currentProfile });
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update profile'));
    }
  },

  getDashboard: async () => {
    try {
      // Future Axios: const response = await api.get('/employee/dashboard'); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            profile: currentProfile,
            attendanceStatus: 'Present',
            leaveBalance: 19,
          });
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch dashboard data'));
    }
  },
};
