import React from 'react';
import { cn } from '../../utils/cn';

export const PageContainer = ({
  title,
  description,
  actions,
  children,
  className = '',
}) => {
  return (
    <div className={cn('p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-1 max-w-3xl">
                {description}
              </p>
            )}
          </div>

          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
