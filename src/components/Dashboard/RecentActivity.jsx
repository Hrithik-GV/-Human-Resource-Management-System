import React from "react";
import { Card, CardHeader, CardTitle } from "../UI/Card";
import { CheckCircle2, XCircle, LogIn, LogOut, FileText, UserPlus } from "lucide-react";

export const RecentActivity = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case "check_in":
        return <LogIn className="w-4 h-4 text-emerald-600" />;
      case "check_out":
        return <LogOut className="w-4 h-4 text-amber-600" />;
      case "leave_approved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "leave_rejected":
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case "leave_apply":
        return <FileText className="w-4 h-4 text-brand-600" />;
      case "employee_add":
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case "check_in":
        return "bg-emerald-50 border border-emerald-100";
      case "check_out":
        return "bg-amber-50 border border-amber-100";
      case "leave_approved":
        return "bg-emerald-50 border border-emerald-100";
      case "leave_rejected":
        return "bg-rose-50 border border-rose-100";
      case "leave_apply":
        return "bg-brand-50 border border-brand-100";
      case "employee_add":
        return "bg-blue-50 border border-blue-100";
      default:
        return "bg-slate-50 border border-slate-100";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No recent activity logged.</p>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${getBg(act.type)}`}>
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 leading-normal">
                  {act.title}
                </p>
                {act.description && (
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{act.description}</p>
                )}
                <span className="text-[10px] text-slate-400 mt-1 block">{act.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
