import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all duration-200 hover:shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={cn('px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-1', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={cn('text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={cn('text-xs text-slate-500 dark:text-slate-400', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={cn('px-6 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
