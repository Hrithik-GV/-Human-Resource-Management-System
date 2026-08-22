import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('dayflow_token');
      if (!token) {
        setCurrentUser(null);
        return null;
      }
      const user = await authService.getCurrentUser(token);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('dayflow_user', JSON.stringify(user));
      }
      return user;
    } catch (err) {
      console.error('Failed to refresh user credentials', err);
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_user');
      setCurrentUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('dayflow_token');
        const savedUser = localStorage.getItem('dayflow_user');

        if (token && savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        } else if (token) {
          await refreshUser();
        }
      } catch (err) {
        localStorage.removeItem('dayflow_token');
        localStorage.removeItem('dayflow_user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user, token } = await authService.login(email, password);
      localStorage.setItem('dayflow_token', token);
      localStorage.setItem('dayflow_user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { user, token } = await authService.register(userData);
      localStorage.setItem('dayflow_token', token);
      localStorage.setItem('dayflow_user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    role: currentUser?.role || null,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
