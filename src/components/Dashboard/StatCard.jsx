import React from "react";
import { Card } from "../UI/Card";

export const StatCard = ({ title, value, icon: Icon, description, trend, trendType = "up", className = "" }) => {
  return (
    <Card className={`flex items-start justify-between ${className}`}>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
        {(description || trend) && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {trend && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                trendType === "up" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}>
                {trend}
              </span>
            )}
            {description && <span className="text-xs text-slate-400">{description}</span>}
          </div>
        )}
      </div>
      {Icon && (
        <div className="p-3 bg-brand-50 border border-brand-100/50 rounded-xl text-brand-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </Card>
  );
};
