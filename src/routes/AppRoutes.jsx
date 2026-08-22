import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "../constants/paths";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";

// Employee Pages
import { Dashboard as EmployeeDashboard } from "../pages/employee/Dashboard";
import { Profile as EmployeeProfile } from "../pages/employee/Profile";
import { Attendance as EmployeeAttendance } from "../pages/employee/Attendance";
import { Leave as EmployeeLeave } from "../pages/employee/Leave";
import { Payroll as EmployeePayroll } from "../pages/employee/Payroll";

// Admin Pages
import { Dashboard as AdminDashboard } from "../pages/admin/Dashboard";
import { Employees as AdminEmployees } from "../pages/admin/Employees";
import { Attendance as AdminAttendance } from "../pages/admin/Attendance";
import { LeaveRequests as AdminLeaves } from "../pages/admin/LeaveRequests";
import { Payroll as AdminPayroll } from "../pages/admin/Payroll";
import { Departments as AdminDepartments } from "../pages/admin/Departments";
import { Reports as AdminReports } from "../pages/admin/Reports";

// Shared Pages
import { Settings } from "../pages/shared/Settings";
import { NotFound } from "../pages/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={PATHS.LOGIN} replace />} />

      {/* Auth Routes */}
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route path={PATHS.REGISTER} element={<Register />} />

      {/* Protected Employee Routes */}
      <Route
        path={PATHS.EMPLOYEE_DASHBOARD}
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout title="Employee Dashboard">
              <EmployeeDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.EMPLOYEE_PROFILE}
        element={
          <ProtectedRoute>
            <DashboardLayout title="My Profile">
              <EmployeeProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.EMPLOYEE_ATTENDANCE}
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout title="My Attendance">
              <EmployeeAttendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.EMPLOYEE_LEAVE}
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout title="Leave Management">
              <EmployeeLeave />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.EMPLOYEE_PAYROLL}
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout title="My Payroll">
              <EmployeePayroll />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.EMPLOYEE_SETTINGS}
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout title="Settings">
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path={PATHS.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Admin Dashboard">
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN_EMPLOYEES}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Employees">
              <AdminEmployees />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN_ATTENDANCE}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Workforce Attendance">
              <AdminAttendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN_LEAVES}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Leave Requests">
              <AdminLeaves />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN_PAYROLL}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Payroll Management">
              <AdminPayroll />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN_DEPARTMENTS}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Departments">
              <AdminDepartments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN_REPORTS}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Reports">
              <AdminReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ADMIN_SETTINGS}
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout title="Settings">
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
