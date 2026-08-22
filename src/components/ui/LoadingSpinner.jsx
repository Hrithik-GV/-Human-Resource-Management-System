import React from 'react';
import { cn } from '../../utils/cn';

export const LoadingSpinner = ({
  size = 'md',
  className = '',
  label = 'Loading...',
  fullPage = false,
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div
        className={cn(
          'animate-spin rounded-full border-slate-200 border-t-indigo-600',
          sizes[size],
          className
        )}
      />
      {label && <p className="text-xs font-medium text-slate-500">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 backdrop-blur-xs">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};
