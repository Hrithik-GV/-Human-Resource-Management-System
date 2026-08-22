import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Menu, LogOut, User, Settings, Check } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../constants/paths";
import { Avatar } from "../UI/Avatar";
import { Badge } from "../UI/Badge";

export const Header = ({ title = "Dashboard", toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Leave request approved by HR manager", time: "2 hours ago", read: false },
    { id: 2, text: "Payroll slip for July 2026 is available", time: "1 day ago", read: false },
    { id: 3, text: "Welcome to Dayflow HR portal!", time: "5 days ago", read: true },
  ]);

  if (!currentUser) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleSidebar(true)}
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">
          {title}
        </h1>
      </div>

      {/* Right side search + icons */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, documents..."
            className="pl-9 pr-4 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-full w-56 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-100 rounded-xl shadow-premium-lg z-50 p-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs leading-relaxed transition-colors ${
                      n.read ? "bg-white text-slate-500" : "bg-brand-50/50 text-slate-800 font-medium"
                    }`}
                  >
                    <p>{n.text}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 text-left transition-colors"
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.name}
              </p>
              <Badge variant={currentUser.role === "admin" ? "danger" : "info"} className="mt-0.5 scale-90 -translate-x-1 origin-left">
                {currentUser.role}
              </Badge>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-xl shadow-premium-lg z-50 p-2 animate-fade-in">
              <Link
                to={PATHS.EMPLOYEE_PROFILE}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                My Profile
              </Link>
              <Link
                to={currentUser.role === "admin" ? PATHS.ADMIN_SETTINGS : PATHS.EMPLOYEE_SETTINGS}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
              <hr className="my-1 border-slate-100" />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
