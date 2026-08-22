import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/Dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Badge } from "../../components/UI/Badge";
import { Select } from "../../components/UI/Select";
import { Avatar } from "../../components/UI/Avatar";
import { Clock, Users, UserMinus, HelpCircle } from "lucide-react";

export const Attendance = () => {
  const { employees, attendance } = useApp();
  const [filterDate, setFilterDate] = useState("2026-08-21"); // default to mock peak day
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const getStatusVariant = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Half Day":
        return "warning";
      case "Leave":
        return "info";
      case "Absent":
      default:
        return "danger";
    }
  };

  // Filter logs
  const filtered = attendance.filter((att) => {
    const emp = employees.find((e) => e.id === att.employeeId);
    if (!emp) return false;

    const matchDate = filterDate ? att.date === filterDate : true;
    const matchDept = filterDept ? emp.department === filterDept : true;
    const matchStatus = filterStatus ? att.status === filterStatus : true;

    return matchDate && matchDept && matchStatus;
  });

  // Calculate statistics for the selected date
  const selectedDateAttendance = attendance.filter((att) => att.date === filterDate);
  const totalOnDate = selectedDateAttendance.length;
  const presentOnDate = selectedDateAttendance.filter((a) => a.status === "Present").length;
  const halfDaysOnDate = selectedDateAttendance.filter((a) => a.status === "Half Day").length;
  const leavesOnDate = selectedDateAttendance.filter((a) => a.status === "Leave").length;
  const absentsOnDate = selectedDateAttendance.filter((a) => a.status === "Absent").length;

  const departmentOptions = [
    { value: "Engineering", label: "Engineering" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Sales", label: "Sales" },
  ];

  const statusOptions = [
    { value: "Present", label: "Present" },
    { value: "Half Day", label: "Half Day" },
    { value: "Leave", label: "Leave" },
    { value: "Absent", label: "Absent" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Workforce Attendance Log</h2>
        <p className="text-xs text-slate-400 mt-1">Check today's logins, total active logs, check-out status, and durations across departments.</p>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Present Today" value={presentOnDate} icon={Users} description="Fully active staff" />
        <StatCard title="Half Days Today" value={halfDaysOnDate} icon={Clock} description="Partial log sessions" />
        <StatCard title="Leaves Scheduled" value={leavesOnDate} icon={UserMinus} description="Approved leaves today" />
        <StatCard title="Unexplained Absences" value={absentsOnDate} icon={HelpCircle} className="text-rose-600" description="Awaiting checklist" />
      </div>

      {/* Filter panel */}
      <Card className="!p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex flex-col gap-1.5 w-full sm:flex-1">
          <label htmlFor="filter-date" className="text-xs font-semibold text-slate-600">Selected Date</label>
          <input
            id="filter-date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto self-end">
          <Select
            label="Department"
            id="filter-dept"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            options={departmentOptions}
            placeholder="All Departments"
            className="!min-w-[150px]"
          />
          <Select
            label="Status"
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
            placeholder="All Statuses"
            className="!min-w-[150px]"
          />
        </div>
      </Card>

      {/* Table log */}
      <Card>
        <CardContent className="!p-0">
          <Table>
            <THead>
              <TR>
                <TH>Employee</TH>
                <TH>Date</TH>
                <TH>Check In</TH>
                <TH>Check Out</TH>
                <TH>Hours Worked</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((att) => {
                const emp = employees.find((e) => e.id === att.employeeId) || { name: "Unknown", avatar: "", department: "" };
                return (
                  <TR key={att.id}>
                    <TD className="flex items-center gap-3">
                      <Avatar src={emp.avatar} name={emp.name} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 leading-normal">{emp.department}</p>
                      </div>
                    </TD>
                    <TD>{att.date}</TD>
                    <TD className="font-semibold text-slate-800">{att.checkIn || "-"}</TD>
                    <TD className="font-semibold text-slate-800">{att.checkOut || "-"}</TD>
                    <TD className="font-semibold text-slate-700">{att.hours ? `${att.hours} hrs` : "-"}</TD>
                    <TD>
                      <Badge variant={getStatusVariant(att.status)}>{att.status}</Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
export default Attendance;
