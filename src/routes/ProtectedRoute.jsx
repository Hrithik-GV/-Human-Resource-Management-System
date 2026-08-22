import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PATHS } from "../constants/paths";

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // Redirect mismatches to respective homepage dashboards
    return currentUser.role === "admin" ? (
      <Navigate to={PATHS.ADMIN_DASHBOARD} replace />
    ) : (
      <Navigate to={PATHS.EMPLOYEE_DASHBOARD} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
