import React from "react";

export const Avatar = ({ src, name, size = "md", className = "" }) => {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return "";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return src ? (
    <img
      src={src}
      alt={name || "Avatar"}
      className={`rounded-full object-cover border border-slate-100 ${sizes[size]} ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name || "User"}`;
      }}
    />
  ) : (
    <div
      className={`rounded-full flex items-center justify-center font-semibold bg-brand-100 text-brand-700 border border-brand-200 uppercase ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
