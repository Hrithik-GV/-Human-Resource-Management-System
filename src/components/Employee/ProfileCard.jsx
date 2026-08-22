import React from "react";
import { Card } from "../UI/Card";
import { Avatar } from "../UI/Avatar";
import { Badge } from "../UI/Badge";
import { Button } from "../UI/Button";
import { Edit, Briefcase, Calendar, MapPin } from "lucide-react";

export const ProfileCard = ({ employee, onEditClick }) => {
  if (!employee) return null;

  return (
    <Card className="relative overflow-hidden">
      {/* Cover highlight strip */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-brand-600" />
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pt-4">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <Avatar src={employee.avatar} name={employee.name} size="xl" className="border-4 border-slate-50 shadow-md" />
          <div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
              <Badge variant={employee.status === "Active" ? "success" : "neutral"}>
                {employee.status}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-1">{employee.position}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-3 font-medium">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {employee.department}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joined {employee.joiningDate}
              </span>
              {employee.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  ID: {employee.id}
                </span>
              )}
            </div>
          </div>
        </div>

        {onEditClick && (
          <Button variant="secondary" size="sm" onClick={onEditClick} className="flex items-center gap-1.5">
            <Edit className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        )}
      </div>
    </Card>
  );
};
