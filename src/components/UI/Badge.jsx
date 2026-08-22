import React from "react";

export const Badge = ({ children, variant = "info", className = "" }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-rose-50 text-rose-700 border border-rose-100",
    info: "bg-blue-50 text-blue-700 border border-blue-100",
    neutral: "bg-slate-50 text-slate-600 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
