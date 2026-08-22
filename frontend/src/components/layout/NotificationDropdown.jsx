import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Clock, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Leave Request Approved',
      message: 'Your leave application for Aug 28 has been approved by HR.',
      time: '10m ago',
      unread: true,
      type: 'success',
    },
    {
      id: 2,
      title: 'Timesheet Reminder',
      message: 'Remember to submit your weekly timesheet log before 6 PM today.',
      time: '2h ago',
      unread: true,
      type: 'info',
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'Dayflow portal will undergo routine maintenance on Sunday at 2 AM.',
      time: '1d ago',
      unread: false,
      type: 'warning',
    },
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-slate-200 py-2 focus:outline-none animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-3.5 hover:bg-slate-50 transition-colors flex gap-3 text-left',
                    item.unread && 'bg-indigo-50/40'
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {item.type === 'info' && <Info className="w-4 h-4 text-indigo-600" />}
                    {item.type === 'warning' && <Clock className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{item.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
