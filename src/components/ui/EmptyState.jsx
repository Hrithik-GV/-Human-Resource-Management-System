import React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Data Found',
  description = 'There are no records available at the moment.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300', className)}>
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
