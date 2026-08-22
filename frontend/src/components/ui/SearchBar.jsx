import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-10 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(''))}
          className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
