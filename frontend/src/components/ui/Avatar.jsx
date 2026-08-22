import React from 'react';
import { cn } from '../../utils/cn';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  status,
  ...props
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs select-none',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white',
            status === 'online' && 'bg-emerald-500',
            status === 'offline' && 'bg-slate-300',
            status === 'busy' && 'bg-rose-500',
            status === 'away' && 'bg-amber-500'
          )}
        />
      )}
    </div>
  );
};
