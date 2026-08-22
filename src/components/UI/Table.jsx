import React from "react";

export const Table = ({ children, className = "" }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-100 shadow-premium">
      <table className={`w-full text-left border-collapse bg-white ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const THead = ({ children, className = "" }) => (
  <thead className={`bg-slate-50 border-b border-slate-100 ${className}`}>{children}</thead>
);

export const TBody = ({ children, className = "" }) => (
  <tbody className={`divide-y divide-slate-100 ${className}`}>{children}</tbody>
);

export const TR = ({ children, className = "", onClick }) => (
  <tr 
    className={`hover:bg-slate-50/50 transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TH = ({ children, className = "" }) => (
  <th className={`px-5 py-3 text-xs font-semibold text-slate-500 tracking-wider uppercase ${className}`}>
    {children}
  </th>
);

export const TD = ({ children, className = "" }) => (
  <td className={`px-5 py-3.5 text-sm text-slate-700 font-medium ${className}`}>{children}</td>
);
