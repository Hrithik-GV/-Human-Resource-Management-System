import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, Settings, LogOut, Search, Sun, Moon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { PAGE_TITLES } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Header = ({ onToggleMobileSidebar = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dropdownItems = [
    {
      label: 'Profile',
      icon: User,
      onClick: () => navigate(role === 'admin' ? '/admin/profile' : '/employee/profile'),
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate(role === 'admin' ? '/admin/settings' : '/employee/settings'),
    },
    { divider: true },
    {
      label: 'Logout',
      icon: LogOut,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Center/Right: Search Box & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Box */}
        <div className="relative hidden md:flex items-center w-48 lg:w-64">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search portal..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-200" />

        {/* Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none">
              <Avatar
                src={currentUser?.avatar}
                name={currentUser?.fullName || 'User'}
                size="sm"
                status="online"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.fullName || 'User'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentUser?.title || (role === 'admin' ? 'Administrator' : 'Employee')}
                </span>
              </div>
              <Badge
                variant={role === 'admin' ? 'primary' : 'info'}
                size="sm"
                className="hidden lg:inline-flex capitalize ml-1"
              >
                {role || 'user'}
              </Badge>
            </button>
          }
          items={dropdownItems}
        />
      </div>
    </header>
  );
};
