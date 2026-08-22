import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../constants/paths";
import { formatCurrency } from "../../utils/format";
import { StatCard } from "../../components/Dashboard/StatCard";
import { AttendanceChart } from "../../components/Dashboard/AttendanceChart";
import { RecentActivity } from "../../components/Dashboard/RecentActivity";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Badge } from "../../components/UI/Badge";
import { Users, UserCheck, CalendarDays, ClipboardList, ArrowRight, UserPlus, Clock } from "lucide-react";

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { employees, attendance, leaves, payroll } = useApp();

  if (!currentUser) return null;

  // Stats calculation
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((emp) => emp.status === "Active").length;
  const totalLeavesApplied = leaves.length;
  const pendingLeaves = leaves.filter((lv) => lv.status === "Pending").length;
  const totalPayrollExpenses = payroll.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((att) => att.date === todayStr);
  const presentToday = todayAttendance.filter((att) => att.status === "Present" || att.status === "Half Day").length;
  const attendanceRate = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(0) : 0;

  // Weekly Working Hours Chart Data
  const chartData = [
    { name: "Mon", hours: 45 },
    { name: "Tue", hours: 52 },
    { name: "Wed", hours: 49 },
    { name: "Thu", hours: 60 },
    { name: "Fri", hours: 48 },
  ];

  // Activities logs mapping
  const activities = [];
  attendance.slice(0, 3).forEach((att) => {
    const emp = employees.find((e) => e.id === att.employeeId) || { name: "Unknown Staff" };
    activities.push({
      id: `att-${att.id}`,
      type: "check_in",
      title: `${emp.name} Checked In`,
      description: `Logged check-in status at ${att.checkIn}`,
      time: att.date,
    });
  });

  leaves.slice(0, 2).forEach((lv) => {
    activities.push({
      id: `lv-${lv.id}`,
      type: lv.status === "Approved" ? "leave_approved" : lv.status === "Rejected" ? "leave_rejected" : "leave_apply",
      title: `Leave ${lv.status}`,
      description: `${lv.employeeName} submitted a ${lv.leaveType} request.`,
      time: lv.startDate,
    });
  });

  const sortedActivities = activities.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Welcome Back, {currentUser.name}</h2>
          <p className="text-xs text-slate-400 mt-1">Here is the workforce status overview for Dayflow HR systems.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger" className="py-1 px-3">
            Admin Console
          </Badge>
          <Link to={PATHS.ADMIN_EMPLOYEES}>
            <Button size="sm" className="flex items-center gap-1.5 text-xs py-1.5 px-3">
              <UserPlus className="w-3.5 h-3.5" /> Add Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Corporate Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Staff"
          value={totalEmployees}
          icon={Users}
          description={`${activeEmployees} active workforce accounts`}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={UserCheck}
          description={`${presentToday} employees present today`}
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves}
          icon={CalendarDays}
          description={`${totalLeavesApplied} total leave applications`}
        />
        <StatCard
          title="Payroll Expenses"
          value={formatCurrency(totalPayrollExpenses)}
          icon={ClipboardList}
          description="Operational salary payouts"
        />
      </div>

      {/* Attendance & Leave Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>Attendance Quick Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Present Today</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Out of {totalEmployees} registered staff</p>
                </div>
                <span className="text-xl font-bold text-slate-800">{presentToday}</span>
              </div>
              <p className="text-xs text-slate-400">
                Weekly stats are consolidated automatically under the Attendance register tab.
              </p>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <Link to={PATHS.ADMIN_ATTENDANCE}>
              <Button variant="secondary" className="w-full justify-center gap-1">
                View Attendance Register <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Leave Requests Overview */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>Pending Leave Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Total Pending Requests</span>
                <span className="text-amber-600 font-bold">{pendingLeaves} Requests</span>
              </div>
              <p className="text-xs text-slate-400">
                Pending applications require quick action to ensure correct monthly schedule allocation.
              </p>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <Link to={PATHS.ADMIN_LEAVES}>
              <Button variant="secondary" className="w-full justify-center gap-1">
                Process Leave Applications <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Payroll Summary */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>Monthly Payroll Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MONTHLY SALARY EXPENSES</p>
                <h3 className="text-2xl font-extrabold text-emerald-800 mt-1">
                  {formatCurrency(totalPayrollExpenses)}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Payroll updates are compiled based on active base values and active deductions logs.
              </p>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <Link to={PATHS.ADMIN_PAYROLL}>
              <Button variant="secondary" className="w-full justify-center gap-1">
                Manage Corporate Payroll <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart title="Average Daily Working Hours" data={chartData} />
        </div>
        <div>
          <RecentActivity activities={sortedActivities} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
