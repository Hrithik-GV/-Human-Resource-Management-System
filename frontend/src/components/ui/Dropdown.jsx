import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-48 rounded-lg bg-white shadow-lg border border-slate-200 py-1 focus:outline-none animate-in fade-in duration-150',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="my-1 border-t border-slate-100" />;
            }

            const Icon = item.icon;

            return (
              <button
                key={item.label || index}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors',
                  item.danger && 'text-rose-600 hover:bg-rose-50'
                )}
              >
                {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
