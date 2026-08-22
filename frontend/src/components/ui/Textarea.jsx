import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  id,
  containerClassName = '',
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg px-3.5 py-2.5 transition-colors duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-y',
          error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-rose-600 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
