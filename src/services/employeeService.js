import { MOCK_EMPLOYEE_PROFILE } from '../data/employees';

let currentProfile = { ...MOCK_EMPLOYEE_PROFILE };

export const employeeService = {
  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...currentProfile });
      }, 300);
    });
  },

  updateProfile: async (updateData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentProfile = {
          ...currentProfile,
          phone: updateData.phone !== undefined ? updateData.phone : currentProfile.phone,
          address: updateData.address !== undefined ? updateData.address : currentProfile.address,
          avatar: updateData.avatar !== undefined ? updateData.avatar : currentProfile.avatar,
        };
        resolve({ ...currentProfile });
      }, 400);
    });
  },
};
