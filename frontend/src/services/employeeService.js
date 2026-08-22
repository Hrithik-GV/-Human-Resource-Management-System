import api, { handleApiError } from './api';
import { MOCK_EMPLOYEE_PROFILE, MOCK_ADMIN_PROFILE } from '../data/employees';

let employeeProfile = { ...MOCK_EMPLOYEE_PROFILE };
let adminProfile = { ...MOCK_ADMIN_PROFILE };

export const employeeService = {
  getProfile: async () => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedUser = localStorage.getItem('dayflow_user');
          const currentUser = savedUser ? JSON.parse(savedUser) : null;

          if (currentUser?.role === 'admin') {
            resolve({
              ...adminProfile,
              fullName: currentUser.fullName || adminProfile.fullName,
              email: currentUser.email || adminProfile.email,
              avatar: currentUser.avatar || adminProfile.avatar,
              phone: currentUser.phone || adminProfile.phone,
              address: currentUser.address || adminProfile.address,
            });
          } else {
            resolve({
              ...employeeProfile,
              fullName: currentUser?.fullName || employeeProfile.fullName,
              email: currentUser?.email || employeeProfile.email,
              avatar: currentUser?.avatar || employeeProfile.avatar,
              phone: currentUser?.phone || employeeProfile.phone,
              address: currentUser?.address || employeeProfile.address,
            });
          }
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user profile'));
    }
  },

  updateProfile: async (updateData) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedUser = localStorage.getItem('dayflow_user');
          const currentUser = savedUser ? JSON.parse(savedUser) : {};
          const isAdmin = currentUser.role === 'admin';

          const targetProfile = isAdmin ? adminProfile : employeeProfile;

          const updated = {
            ...targetProfile,
            ...currentUser,
            phone: updateData.phone !== undefined ? updateData.phone : targetProfile.phone,
            address: updateData.address !== undefined ? updateData.address : targetProfile.address,
            avatar: updateData.avatar !== undefined ? updateData.avatar : targetProfile.avatar,
          };

          if (isAdmin) {
            adminProfile = updated;
          } else {
            employeeProfile = updated;
          }

          // Persist in localStorage session
          const updatedUserSession = {
            ...currentUser,
            phone: updated.phone,
            address: updated.address,
            avatar: updated.avatar,
          };
          localStorage.setItem('dayflow_user', JSON.stringify(updatedUserSession));

          resolve(updated);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update profile'));
    }
  },

  getDashboard: async () => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            profile: employeeProfile,
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
