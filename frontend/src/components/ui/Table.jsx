import React from 'react';
import { cn } from '../../utils/cn';

export const Table = ({ children, className = '', ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className={cn('w-full text-left text-sm text-slate-600', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={cn('bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200', className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={cn('divide-y divide-slate-200', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', hover = true, ...props }) => (
  <tr className={cn(hover && 'hover:bg-slate-50/60 transition-colors duration-150', className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', ...props }) => (
  <th className={cn('px-6 py-3.5 tracking-wider font-semibold text-slate-700', className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '', ...props }) => (
  <td className={cn('px-6 py-4 whitespace-nowrap text-slate-800', className)} {...props}>
    {children}
  </td>
);
