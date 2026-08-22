import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts (Static for fast shell render)
import { AuthLayout } from '../layouts/AuthLayout';
import { EmployeeLayout } from '../layouts/EmployeeLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// UI Loading Fallback
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Route Guard
import { ProtectedRoute } from './ProtectedRoute';

// Lazy-loaded Pages
const Login = lazy(() => import('../pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/auth/Register').then(m => ({ default: m.Register })));

const EmployeeDashboard = lazy(() => import('../pages/employee/EmployeeDashboard').then(m => ({ default: m.EmployeeDashboard })));
const EmployeeProfile = lazy(() => import('../pages/employee/EmployeeProfile').then(m => ({ default: m.EmployeeProfile })));
const EmployeeAttendance = lazy(() => import('../pages/employee/EmployeeAttendance').then(m => ({ default: m.EmployeeAttendance })));
const EmployeeLeave = lazy(() => import('../pages/employee/EmployeeLeave').then(m => ({ default: m.EmployeeLeave })));
const EmployeePayroll = lazy(() => import('../pages/employee/EmployeePayroll').then(m => ({ default: m.EmployeePayroll })));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminEmployees = lazy(() => import('../pages/admin/AdminEmployees').then(m => ({ default: m.AdminEmployees })));
const AdminAttendance = lazy(() => import('../pages/admin/AdminAttendance').then(m => ({ default: m.AdminAttendance })));
const AdminLeaves = lazy(() => import('../pages/admin/AdminLeaves').then(m => ({ default: m.AdminLeaves })));
const AdminPayroll = lazy(() => import('../pages/admin/AdminPayroll').then(m => ({ default: m.AdminPayroll })));

const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullPage label="Loading workspace..." />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Employee Routes */}
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

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="leaves" element={<AdminLeaves />} />
            <Route path="payroll" element={<AdminPayroll />} />
          </Route>
        </Route>

        {/* Settings Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/settings" element={<EmployeeLayout />}>
            <Route index element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
