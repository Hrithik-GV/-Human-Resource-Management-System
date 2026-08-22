import React from 'react';
import { cn } from '../../utils/cn';
import { BADGE_VARIANTS } from '../../constants/theme';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    primary: 'bg-indigo-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors duration-150',
        BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral,
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant] || dotColors.neutral)} />
      )}
      {children}
    </span>
  );
};
