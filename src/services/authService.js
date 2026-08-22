import { MOCK_USERS } from '../data/mockUsers';

export const authService = {
  login: async (email, password) => {
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
      }, 500);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: userData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
          employeeId: userData.employeeId,
          fullName: userData.fullName,
          email: userData.email,
          role: userData.role || 'employee',
          title: userData.role === 'admin' ? 'HR Specialist' : 'Software Engineer',
          department: userData.role === 'admin' ? 'Human Resources' : 'Engineering',
        };

        resolve({
          user: newUser,
          token: `dayflow_jwt_mock_${newUser.role}_${Date.now()}`,
        });
      }, 500);
    });
  },

  logout: async () => {
    return Promise.resolve(true);
  },

  getCurrentUser: async (token) => {
    return new Promise((resolve, reject) => {
      if (!token) return resolve(null);
      const isAdmin = token.includes('admin');
      const mockUser = isAdmin ? MOCK_USERS[1] : MOCK_USERS[0];
      const userResponse = { ...mockUser };
      delete userResponse.password;
      resolve(userResponse);
    });
  },
};
