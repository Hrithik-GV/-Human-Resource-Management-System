// Authentication services layer utilizing localStorage as mock session database
const TOKEN_KEY = "dayflow_jwt_token";
const USER_KEY = "dayflow_current_user";

export const authService = {
  login: async (email, password, employeesList) => {
    // Simulated delay for network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = employeesList.find(
      (emp) => emp.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (password.length < 4) {
      throw new Error("Password must be at least 4 characters");
    }

    // JWT token placeholder setup
    const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token: mockToken };
  },

  register: async (employeeId, name, email, role, employeesList) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const idExists = employeesList.some((emp) => emp.id === employeeId);
    const emailExists = employeesList.some(
      (emp) => emp.email.toLowerCase() === email.toLowerCase()
    );

    if (idExists) {
      throw new Error("Employee ID already registered");
    }
    if (emailExists) {
      throw new Error("Email address already registered");
    }

    return true;
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return true;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export default authService;
