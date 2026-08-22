import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, role, mustChangePassword, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage label="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Force Change Password flow on first login
  if (mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRole && role !== allowedRole.toLowerCase()) {
    // If role mismatch, redirect to the user's correct dashboard
    const targetDashboard = role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};
