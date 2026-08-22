import React from "react";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };
  return (
    <div
      className={`animate-spin rounded-full border-t-brand-600 border-slate-200 ${sizes[size]} ${className}`}
      role="status"
    />
  );
};

export const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <Spinner size="lg" />
      <span className="text-sm font-semibold text-slate-500">Loading Dayflow...</span>
    </div>
  );
};

export const Skeleton = ({ className = "" }) => {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {Array.from({ length: cols }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
