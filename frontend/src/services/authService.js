import api, { handleApiError } from './api';

const normalizeUser = (user) => ({
  ...user,
  id: user._id,
  fullName: user.name,
  loginId: user.loginId || user.employeeId,
  position: user.designation,
  title: user.designation,
  avatar: user.profilePicture,
  role: user.role?.toLowerCase(),
  mustChangePassword: !!user.mustChangePassword,
  companyName: user.companyName || '',
  companyLogo: user.companyLogo || '',
});

export const authService = {
  login: async (identifier, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: identifier.includes('@') ? identifier : undefined,
        loginId: !identifier.includes('@') ? identifier : undefined,
        password,
      });
      return { ...response.data, user: normalizeUser(response.data.user) };
    } catch (error) {
      throw new Error(handleApiError(error, 'Login failed'));
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return { ...response.data, user: normalizeUser(response.data.user) };
    } catch (error) {
      throw new Error(handleApiError(error, 'Password change failed'));
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        employeeId: userData.employeeId || userData.loginId,
        loginId: userData.loginId || userData.employeeId,
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role === 'admin' ? 'Admin' : 'Employee',
        department: userData.department || (userData.role === 'admin' ? 'Human Resources' : 'General'),
        designation: userData.designation || (userData.role === 'admin' ? 'HR Administrator' : 'Employee'),
        phone: userData.phone || '0000000000',
        address: userData.address || 'Not provided',
        companyName: userData.companyName || '',
        companyLogo: userData.companyLogo || '',
      });
      return { ...response.data, user: normalizeUser(response.data.user) };
    } catch (error) {
      throw new Error(handleApiError(error, 'Registration failed'));
    }
  },

  logout: async () => {
    return true;
  },

  getCurrentUser: async (token) => {
    try {
      if (!token) return null;
      const response = await api.get('/auth/me');
      return normalizeUser(response.data.user);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user profile'));
    }
  },
};
