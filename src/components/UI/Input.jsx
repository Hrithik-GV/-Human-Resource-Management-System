import React from "react";

export const Input = ({
  label,
  id,
  type = "text",
  error,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-white border ${
          error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
        } rounded-lg shadow-sm focus:outline-none focus:ring-4 transition duration-150`}
        {...props}
      />
      {error && <span className="text-xs font-medium text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};
