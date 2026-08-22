import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { EMPLOYEE_NAV_ITEMS, ADMIN_NAV_ITEMS, BOTTOM_NAV_ITEMS } from '../../constants/navigation';

export const Sidebar = ({
  role = 'employee',
  isMobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const mainNavItems = role === 'admin' ? ADMIN_NAV_ITEMS : EMPLOYEE_NAV_ITEMS;

  const handleBottomAction = (item) => {
    if (item.action === 'logout') {
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_role');
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-all duration-300 ease-in-out shadow-lg',
          isCollapsed ? 'w-20' : 'w-64',
          // Mobile placement
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Header / Brand */}
        <div>
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-white leading-none">
                    Dayflow
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 mt-1">
                    {role} portal
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-800/80 space-y-1.5">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            if (item.path) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            }
            return (
              <button
                key={item.label}
                onClick={() => {
                  onCloseMobile();
                  handleBottomAction(item);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
