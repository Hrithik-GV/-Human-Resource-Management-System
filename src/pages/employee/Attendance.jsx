import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AttendanceTable } from "../../components/Employee/AttendanceTable";
import { AttendanceChart } from "../../components/Dashboard/AttendanceChart";
import { StatCard } from "../../components/Dashboard/StatCard";
import { Select } from "../../components/UI/Select";
import { CalendarCheck, CalendarDays, AlertCircle, FileSpreadsheet } from "lucide-react";

export const Attendance = () => {
  const { currentUser, attendance } = useApp();
  const [selectedMonth, setSelectedMonth] = useState("08"); // August as default

  if (!currentUser) return null;

  // Filter records for this user
  const userRecords = attendance.filter((att) => att.employeeId === currentUser.id);

  // Filter by selected month (date string format YYYY-MM-DD)
  const filteredRecords = userRecords.filter((rec) => {
    if (!selectedMonth) return true;
    const parts = rec.date.split("-");
    return parts[1] === selectedMonth;
  });

  // Calculate metrics
  const totalDays = filteredRecords.length;
  const present = filteredRecords.filter((r) => r.status === "Present").length;
  const halfDays = filteredRecords.filter((r) => r.status === "Half Day").length;
  const leaves = filteredRecords.filter((r) => r.status === "Leave").length;
  const absent = filteredRecords.filter((r) => r.status === "Absent").length;

  // Chart data
  const chartData = [...filteredRecords]
    .reverse()
    .slice(0, 10)
    .map((rec) => {
      const date = new Date(rec.date);
      const name = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { name, hours: rec.hours || 0 };
    });

  const monthOptions = [
    { value: "07", label: "July 2026" },
    { value: "08", label: "August 2026" },
    { value: "09", label: "September 2026" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Attendance</h2>
          <p className="text-xs text-slate-400 mt-1">Review your login logs, total hours, and work pattern statistics.</p>
        </div>
        <div className="w-full sm:w-48">
          <Select
            id="month-filter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={monthOptions}
            placeholder="Select Month"
          />
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Days" value={totalDays} icon={FileSpreadsheet} className="!p-4" />
        <StatCard title="Present Days" value={present} icon={CalendarCheck} className="!p-4" />
        <StatCard title="Half Days" value={halfDays} icon={CalendarDays} className="!p-4" />
        <StatCard title="Leaves taken" value={leaves} icon={CalendarDays} className="!p-4" />
        <StatCard title="Absences" value={absent} icon={AlertCircle} className="!p-4 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Login Logs & Duration</h3>
            <AttendanceTable records={filteredRecords} />
          </div>
        </div>

        {/* Daily chart trend */}
        <div>
          <AttendanceChart title="Working Hours Trend (Last 10 Entries)" data={chartData} />
        </div>
      </div>
    </div>
  );
};
export default Attendance;
