import api, { handleApiError } from './api';

const normalizeUser = (user) => ({
  ...user,
  id: user._id,
  fullName: user.name,
  position: user.designation,
  title: user.designation,
  avatar: user.profilePicture,
  role: user.role?.toLowerCase(),
});

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { ...response.data, user: normalizeUser(response.data.user) };
    } catch (error) {
      throw new Error(handleApiError(error, 'Login failed'));
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        employeeId: userData.employeeId,
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role === 'admin' ? 'Admin' : 'Employee',
        department: userData.department || (userData.role === 'admin' ? 'Human Resources' : 'General'),
        designation: userData.designation || (userData.role === 'admin' ? 'HR Administrator' : 'Employee'),
        phone: userData.phone || '0000000000',
        address: userData.address || 'Not provided',
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
