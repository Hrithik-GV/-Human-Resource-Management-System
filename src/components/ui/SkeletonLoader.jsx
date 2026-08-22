import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLoader = ({
  variant = 'text',
  className = '',
  count = 1,
}) => {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full w-10 h-10',
    rectangular: 'h-24 w-full rounded-lg',
    card: 'h-48 w-full rounded-xl',
  };

  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-slate-200/80',
            variants[variant] || variants.text,
            className
          )}
        />
      ))}
    </div>
  );
};
