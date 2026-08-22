import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { EmployeeLayout } from '../layouts/EmployeeLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Employee Pages
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { EmployeeProfile } from '../pages/employee/EmployeeProfile';
import { EmployeeAttendance } from '../pages/employee/EmployeeAttendance';
import { EmployeeLeave } from '../pages/employee/EmployeeLeave';
import { EmployeePayroll } from '../pages/employee/EmployeePayroll';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminEmployees } from '../pages/admin/AdminEmployees';
import { AdminAttendance } from '../pages/admin/AdminAttendance';
import { AdminLeaves } from '../pages/admin/AdminLeaves';
import { AdminPayroll } from '../pages/admin/AdminPayroll';

// Common Pages
import { SettingsPage } from '../pages/SettingsPage';
import { NotFound } from '../pages/NotFound';

// Route Guard
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Employee Routes */}
      <Route element={<ProtectedRoute allowedRole="employee" />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="leave" element={<EmployeeLeave />} />
          <Route path="payroll" element={<EmployeePayroll />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="leaves" element={<AdminLeaves />} />
          <Route path="payroll" element={<AdminPayroll />} />
        </Route>
      </Route>

      {/* Authenticated Settings route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/settings" element={<EmployeeLayout />}>
          <Route index element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
