import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Sparkles,
  ClipboardList,
  Landmark,
  FileBarChart2
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../constants/paths";

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";

  const employeeLinks = [
    { name: "Dashboard", path: PATHS.EMPLOYEE_DASHBOARD, icon: LayoutDashboard },
    { name: "My Profile", path: PATHS.EMPLOYEE_PROFILE, icon: User },
    { name: "Attendance", path: PATHS.EMPLOYEE_ATTENDANCE, icon: CalendarCheck },
    { name: "Leave", path: PATHS.EMPLOYEE_LEAVE, icon: CalendarDays },
    { name: "Payroll", path: PATHS.EMPLOYEE_PAYROLL, icon: CreditCard },
  ];

  const adminLinks = [
    { name: "Dashboard", path: PATHS.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { name: "Employees", path: PATHS.ADMIN_EMPLOYEES, icon: Users },
    { name: "Attendance", path: PATHS.ADMIN_ATTENDANCE, icon: CalendarCheck },
    { name: "Leave Requests", path: PATHS.ADMIN_LEAVES, icon: ClipboardList },
    { name: "Payroll", path: PATHS.ADMIN_PAYROLL, icon: CreditCard },
    { name: "Departments", path: PATHS.ADMIN_DEPARTMENTS, icon: Landmark },
    { name: "Reports", path: PATHS.ADMIN_REPORTS, icon: FileBarChart2 },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  const activeClass = "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold bg-brand-50 text-brand-600 border-r-4 border-brand-600 transition-all";
  const inactiveClass = "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[1px] z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="px-6 mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-premium">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              DAYFLOW
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
              HRMS
            </span>
          </div>

          {/* Role Badge inside Sidebar */}
          <div className="px-6 mb-6">
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Logged in as:
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 mt-1 capitalize">
                {currentUser.name}
              </p>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded mt-1.5">
                {currentUser.role} View
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3.5 space-y-1">
            <p className="px-3.5 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {isAdmin ? "Admin Navigation" : "Employee Navigation"}
            </p>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => toggleSidebar(false)}
                  className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="px-3.5 space-y-1 border-t border-slate-100 pt-4">
          <NavLink
            to={isAdmin ? PATHS.ADMIN_SETTINGS : PATHS.EMPLOYEE_SETTINGS}
            onClick={() => toggleSidebar(false)}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            Settings
          </NavLink>
          <button
            onClick={() => {
              toggleSidebar(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-left"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
