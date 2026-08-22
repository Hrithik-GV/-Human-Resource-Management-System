import React from "react";

export const Select = ({
  label,
  id,
  error,
  required = false,
  options = [],
  className = "",
  placeholder = "Select option",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3.5 py-2 text-sm text-slate-900 bg-white border ${
          error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
        } rounded-lg shadow-sm focus:outline-none focus:ring-4 transition duration-150 cursor-pointer`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs font-medium text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};
