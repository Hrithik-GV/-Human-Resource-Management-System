import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/Dashboard/StatCard";
import { AttendanceChart } from "../../components/Dashboard/AttendanceChart";
import { LeaveChart } from "../../components/Dashboard/LeaveChart";
import { RecentActivity } from "../../components/Dashboard/RecentActivity";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Badge } from "../../components/UI/Badge";
import { Users, UserCheck, CalendarClock, CreditCard, UserPlus, Clock, Shield, ArrowRight } from "lucide-react";

export const Dashboard = () => {
  const { employees, attendance, leaves, payroll } = useApp();

  // Metrics calculation
  const totalEmployees = employees.length;

  const todayStr = new Date().toISOString().split("T")[0];
  const presentToday = attendance.filter((att) => att.date === todayStr && (att.status === "Present" || att.status === "Half Day")).length;

  const pendingLeaves = leaves.filter((lv) => lv.status === "Pending").length;

  const totalMonthlyPayroll = payroll.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  // Quick Action triggers
  const actions = [
    { title: "Add Employee", path: "/admin/employees", icon: UserPlus, description: "Register new hire" },
    { title: "View Attendance", path: "/admin/attendance", icon: Clock, description: "Check status logs" },
    { title: "Review Leaves", path: "/admin/leaves", icon: CalendarClock, description: "Approve or reject" },
    { title: "Manage Payroll", path: "/admin/payroll", icon: CreditCard, description: "Adjust salary rates" },
  ];

  // Aggregate attendance data for charts: present rate or total count per department
  const deptMap = {};
  employees.forEach((emp) => {
    deptMap[emp.department] = (deptMap[emp.department] || 0) + 1;
  });
  const deptChartData = Object.keys(deptMap).map((key) => {
    const colors = {
      Engineering: "#3b6be8",
      "Human Resources": "#638cf0",
      Design: "#a5b4fc",
      Marketing: "#cbd5e1",
      Finance: "#94a3b8",
      Sales: "#475569",
    };
    return {
      name: key,
      count: deptMap[key],
      color: colors[key] || "#cbd5e1",
    };
  });

  // Recent system logs
  const systemActivities = [];
  attendance.slice(0, 3).forEach((att) => {
    const emp = employees.find((e) => e.id === att.employeeId);
    if (emp) {
      systemActivities.push({
        id: `sys-in-${att.id}`,
        type: att.checkOut ? "check_out" : "check_in",
        title: `${emp.name} ${att.checkOut ? "Checked Out" : "Checked In"}`,
        description: `${att.checkOut ? `Hours: ${att.hours} hrs` : `In: ${att.checkIn}`}`,
        time: att.date,
      });
    }
  });

  leaves.slice(0, 2).forEach((lv) => {
    systemActivities.push({
      id: `sys-lv-${lv.id}`,
      type: lv.status === "Approved" ? "leave_approved" : lv.status === "Rejected" ? "leave_rejected" : "leave_apply",
      title: `${lv.employeeName} applied for ${lv.leaveType}`,
      description: `Status: ${lv.status} | Days: ${lv.days}`,
      time: lv.startDate,
    });
  });

  const sortedActivities = systemActivities.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Admin Analytics Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time indicators across workforce headcount, daily logins, leaves, and salary operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger" className="py-1 px-3">
            Admin Mode
          </Badge>
          <span className="text-xs font-semibold text-slate-400">System Online</span>
        </div>
      </div>

      {/* Main Admin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={totalEmployees} icon={Users} description="Registered active staff" />
        <StatCard title="Present Today" value={`${presentToday} / ${totalEmployees}`} icon={UserCheck} description="Checked in today" />
        <StatCard title="Pending Leaves" value={pendingLeaves} icon={CalendarClock} description="Awaiting HR approval" trend={pendingLeaves > 0 ? "ATTENTION" : null} trendType="down" />
        <StatCard
          title="Monthly Payroll"
          value={new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalMonthlyPayroll)}
          icon={CreditCard}
          description="Total payout cost log"
        />
      </div>

      {/* Quick actions row */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link key={act.title} to={act.path}>
                <Card className="hover:border-brand-300 hover:shadow-premium-lg transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-50 rounded-xl text-brand-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                        {act.title} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{act.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chart layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeaveChart title="Employee Headcount by Department" data={deptChartData} />
        </div>
        <div>
          <RecentActivity activities={sortedActivities} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
