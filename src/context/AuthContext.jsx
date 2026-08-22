import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, employees, addEmployee, addToast }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password, employees);
      setCurrentUser(response.user);
      addToast(`Welcome back, ${response.user.name}!`, "success");
      return response.user;
    } catch (err) {
      addToast(err.message, "error");
      return null;
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    addToast("Logged out successfully", "info");
  };

  const register = async (employeeId, name, email, password, role) => {
    try {
      await authService.register(employeeId, name, email, role, employees);
      
      const newEmp = {
        id: employeeId,
        name,
        email,
        phone: "+91 99999 88888",
        address: "Update Address",
        dob: "1995-01-01",
        department: "Engineering",
        position: role === "admin" ? "HR Admin" : "Software Engineer",
        joiningDate: new Date().toISOString().split("T")[0],
        status: "Active",
        role: role,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        basicSalary: 60000,
        allowances: 10000,
        bonus: 0,
        deductions: 3000,
      };

      addEmployee(newEmp); // delegates writing the record to AppContext/localStorage
      addToast("Registration successful! You can now log in.", "success");
      return true;
    } catch (err) {
      addToast(err.message, "error");
      return false;
    }
  };

  const syncProfileChange = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        login,
        logout,
        register,
        syncProfileChange,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
