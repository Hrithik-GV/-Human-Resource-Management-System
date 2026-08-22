import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage label="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole.toLowerCase()) {
    // If role mismatch, redirect to the user's correct dashboard
    const targetDashboard = role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};
