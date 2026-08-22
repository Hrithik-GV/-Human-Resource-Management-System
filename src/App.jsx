import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// Auth Pages
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

// Employee Pages
import { Dashboard as EmployeeDashboard } from "./pages/employee/Dashboard";
import { Profile as EmployeeProfile } from "./pages/employee/Profile";
import { Attendance as EmployeeAttendance } from "./pages/employee/Attendance";
import { Leave as EmployeeLeave } from "./pages/employee/Leave";
import { Payroll as EmployeePayroll } from "./pages/employee/Payroll";

// Admin Pages
import { Dashboard as AdminDashboard } from "./pages/admin/Dashboard";
import { Employees as AdminEmployees } from "./pages/admin/Employees";
import { Attendance as AdminAttendance } from "./pages/admin/Attendance";
import { LeaveRequests as AdminLeaves } from "./pages/admin/LeaveRequests";
import { Payroll as AdminPayroll } from "./pages/admin/Payroll";
import { Departments as AdminDepartments } from "./pages/admin/Departments";
import { Reports as AdminReports } from "./pages/admin/Reports";

// Shared Pages
import { Settings } from "./pages/shared/Settings";

// UI Layout Components
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { ToastContainer } from "./components/UI/Toast";

// Guard wrapper to protect routes and roles
const RouteGuard = ({ children, allowedRole }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  // If loading states occur, handle it. Since we load instantly from localStorage,
  // we check if user is verified.
  const storedUser = localStorage.getItem("dayflow_current_user");

  if (!currentUser && !storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Parse user for role checking
  const user = currentUser || JSON.parse(storedUser);

  if (allowedRole && user.role !== allowedRole) {
    // Redirect mismatches to respective homepage dashboards
    return user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/employee/dashboard" replace />
    );
  }

  return children;
};

// Layout wrapper
const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header title={title} toggleSidebar={setSidebarOpen} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const MainRoutes = () => {
  return (
    <Routes>
      {/* Redirect Root to Login/Dashboard */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <RouteGuard allowedRole="employee">
            <DashboardLayout title="Employee Dashboard">
              <EmployeeDashboard />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <RouteGuard>
            <DashboardLayout title="My Profile">
              <EmployeeProfile />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <RouteGuard allowedRole="employee">
            <DashboardLayout title="My Attendance">
              <EmployeeAttendance />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/employee/leave"
        element={
          <RouteGuard allowedRole="employee">
            <DashboardLayout title="Leave Management">
              <EmployeeLeave />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/employee/payroll"
        element={
          <RouteGuard allowedRole="employee">
            <DashboardLayout title="My Payroll">
              <EmployeePayroll />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/employee/settings"
        element={
          <RouteGuard allowedRole="employee">
            <DashboardLayout title="Settings">
              <Settings />
            </DashboardLayout>
          </RouteGuard>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Admin Dashboard">
              <AdminDashboard />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Employees">
              <AdminEmployees />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Workforce Attendance">
              <AdminAttendance />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Leave Requests">
              <AdminLeaves />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Payroll Management">
              <AdminPayroll />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Departments">
              <AdminDepartments />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Reports">
              <AdminReports />
            </DashboardLayout>
          </RouteGuard>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RouteGuard allowedRole="admin">
            <DashboardLayout title="Settings">
              <Settings />
            </DashboardLayout>
          </RouteGuard>
        }
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainRoutes />
        <ToastContainer />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
