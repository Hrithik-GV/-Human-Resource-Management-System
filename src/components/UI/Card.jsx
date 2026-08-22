import React from "react";

export const Card = ({ children, className = "", onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-100 shadow-premium p-6 ${
        onClick ? "cursor-pointer hover:shadow-premium-lg transition-shadow duration-200" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-base font-semibold text-slate-900 ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);
