
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  CreditCard,
  Users,
  UserPlus,
  FileCheck,
  Settings,
  LogOut
} from 'lucide-react';

export const EMPLOYEE_NAV_ITEMS = [
  { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/employee/profile', icon: User },
  { label: 'Attendance', path: '/employee/attendance', icon: Clock },
  { label: 'Leave', path: '/employee/leave', icon: CalendarDays },
  { label: 'Payroll', path: '/employee/payroll', icon: CreditCard },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/admin/employees', icon: Users },
  { label: 'Create Employee', path: '/admin/create-employee', icon: UserPlus },
  { label: 'Attendance', path: '/admin/attendance', icon: Clock },
  { label: 'Leave Requests', path: '/admin/leaves', icon: FileCheck },
  { label: 'Payroll', path: '/admin/payroll', icon: CreditCard },
];

export const BOTTOM_NAV_ITEMS = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Logout', action: 'logout', icon: LogOut },
];

export const PAGE_TITLES = {
  '/employee/dashboard': 'Employee Dashboard',
  '/employee/profile': 'My Profile',
  '/employee/attendance': 'Attendance Records',
  '/employee/leave': 'Leave Management',
  '/employee/payroll': 'Payroll & Payslips',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/profile': 'Admin Profile',
  '/admin/employees': 'Employee Directory',
  '/admin/create-employee': 'Create Employee',
  '/admin/attendance': 'Attendance Overview',
  '/admin/leaves': 'Leave Requests Management',
  '/admin/payroll': 'Payroll Administration',
  '/login': 'Sign In',
  '/register': 'Create Employee (Admin Only)',
  '/change-password': 'Change Temporary Password',
  '/settings': 'Account Settings',
};
