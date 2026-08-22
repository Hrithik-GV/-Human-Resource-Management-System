import React from "react";
import { FolderOpen } from "lucide-react";

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "There are no records matching your criteria.",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 ${className}`}>
      <div className="p-3 bg-white rounded-full border border-slate-100 shadow-sm mb-3">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-[280px]">{description}</p>
    </div>
  );
};
