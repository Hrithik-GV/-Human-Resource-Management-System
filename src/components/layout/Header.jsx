import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, User, Settings, LogOut, Search } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';
import { PAGE_TITLES } from '../../constants/navigation';

export const Header = ({
  role = 'employee',
  user = { name: 'Alex Morgan', role: role === 'admin' ? 'Administrator' : 'HR Specialist' },
  onToggleMobileSidebar = () => {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  const dropdownItems = [
    {
      label: 'My Profile',
      icon: User,
      onClick: () => navigate(role === 'admin' ? '/admin/dashboard' : '/employee/profile'),
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate('/settings'),
    },
    { divider: true },
    {
      label: 'Logout',
      icon: LogOut,
      danger: true,
      onClick: () => {
        localStorage.removeItem('dayflow_token');
        navigate('/login');
      },
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
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search Box */}
        <div className="relative hidden md:flex items-center w-48 lg:w-64">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, leaves..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Notification Icon */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none">
              <Avatar name={user.name} size="sm" status="online" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {user.role}
                </span>
              </div>
              <Badge variant={role === 'admin' ? 'primary' : 'info'} size="sm" className="hidden lg:inline-flex capitalize ml-1">
                {role}
              </Badge>
            </button>
          }
          items={dropdownItems}
        />
      </div>
    </header>
  );
};
