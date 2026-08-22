import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

export const DataStateWrapper = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  onRetry,
  loadingSkeleton,
  emptyTitle = 'No Data Available',
  emptyDescription = 'There are no records available at this time.',
  children,
}) => {
  if (isLoading) {
    if (loadingSkeleton) return loadingSkeleton;
    return (
      <div className="p-6">
        <SkeletonLoader variant="rectangular" className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-rose-200">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Failed to Load Data</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-6">{typeof error === 'string' ? error : 'Something went wrong while fetching information.'}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4 text-indigo-600" />}
          >
            Retry Request
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return children;
};
