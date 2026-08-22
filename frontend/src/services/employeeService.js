import api, { handleApiError } from './api';

const normalizeProfile = (user) => ({
  ...user,
  id: user._id,
  fullName: user.name,
  position: user.designation,
  status: 'Active',
  avatar: user.profilePicture,
});

export const employeeService = {
  getProfile: async () => {
    try {
      const response = await api.get('/employee/profile');
      return normalizeProfile(response.data.user);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user profile'));
    }
  },

  updateProfile: async (updateData) => {
    try {
      const response = await api.put('/employee/profile', {
        ...updateData,
        profilePicture: updateData.avatar,
      });
      return normalizeProfile(response.data.user);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update profile'));
    }
  },

  getDashboard: async () => {
    try {
      const response = await api.get('/employee/dashboard');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch dashboard data'));
    }
  },
};
