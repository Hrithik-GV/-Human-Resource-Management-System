import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/Dashboard/StatCard";
import { AttendanceChart } from "../../components/Dashboard/AttendanceChart";
import { RecentActivity } from "../../components/Dashboard/RecentActivity";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Badge } from "../../components/UI/Badge";
import { Calendar, Clock, Landmark, CreditCard, ChevronRight, Play, Square } from "lucide-react";

export const Dashboard = () => {
  const { currentUser, attendance, leaves, payroll, checkIn, checkOut } = useApp();

  if (!currentUser) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecord = attendance.find(
    (att) => att.employeeId === currentUser.id && att.date === todayStr
  );

  // Stats calculation
  const employeeAttendance = attendance.filter((att) => att.employeeId === currentUser.id);
  const presentDays = employeeAttendance.filter((att) => att.status === "Present" || att.status === "Half Day").length;
  const totalHours = employeeAttendance.reduce((acc, curr) => acc + (curr.hours || 0), 0).toFixed(1);

  const employeeLeaves = leaves.filter((lv) => lv.employeeId === currentUser.id);
  const pendingLeaves = employeeLeaves.filter((lv) => lv.status === "Pending").length;
  const approvedLeaves = employeeLeaves.filter((lv) => lv.status === "Approved").length;
  const leaveBalance = 15 - approvedLeaves; // Let's say base is 15 days

  const employeePayroll = payroll.filter((pay) => pay.employeeId === currentUser.id);
  const latestPay = employeePayroll[0] || { netSalary: currentUser.basicSalary + currentUser.allowances - currentUser.deductions, month: "July", paymentDate: "2026-07-31" };

  // Generate chart data for current user's last 5 attendance entries
  const chartData = employeeAttendance
    .slice(0, 5)
    .reverse()
    .map((att) => {
      const date = new Date(att.date);
      const name = date.toLocaleDateString("en-US", { weekday: "short" });
      return { name, hours: att.hours || 0 };
    });

  // Recent activity logs for current user
  const userActivities = [];
  employeeAttendance.slice(0, 3).forEach((att) => {
    if (att.checkIn) {
      userActivities.push({
        id: `act-in-${att.id}`,
        type: "check_in",
        title: "Checked In Today",
        description: `Logged in at ${att.checkIn}`,
        time: att.date,
      });
    }
    if (att.checkOut) {
      userActivities.push({
        id: `act-out-${att.id}`,
        type: "check_out",
        title: "Checked Out Today",
        description: `Logged out at ${att.checkOut} (${att.hours} hrs)`,
        time: att.date,
      });
    }
  });
  employeeLeaves.slice(0, 2).forEach((lv) => {
    userActivities.push({
      id: `act-lv-${lv.id}`,
      type: lv.status === "Approved" ? "leave_approved" : lv.status === "Rejected" ? "leave_rejected" : "leave_apply",
      title: `${lv.leaveType} Request ${lv.status}`,
      description: `Reason: ${lv.reason}`,
      time: lv.startDate,
    });
  });

  const sortedActivities = userActivities.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);

  // Greeting helper
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {getGreeting()}, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Here is a snapshot of your workplace statistics today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="py-1 px-3">
            Employee Portal
          </Badge>
          <span className="text-xs font-semibold text-slate-400">
            {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance status"
          value={todayRecord ? todayRecord.status : "Not Checked In"}
          icon={Calendar}
          description={todayRecord ? `Checked in at ${todayRecord.checkIn}` : "Tap check-in to begin"}
          trend={todayRecord ? "ACTIVE" : "INACTIVE"}
          trendType={todayRecord ? "up" : "down"}
        />
        <StatCard
          title="Leave Balance"
          value={`${leaveBalance} Days`}
          icon={Clock}
          description={`${pendingLeaves} pending approvals`}
        />
        <StatCard
          title="Present Days"
          value={`${presentDays} Days`}
          icon={Landmark}
          description="Accumulated this month"
        />
        <StatCard
          title="Working Hours"
          value={`${totalHours} Hrs`}
          icon={CreditCard}
          description="Total hours logged"
        />
      </div>

      {/* Middle dashboard cards: Clock In/Out & Leave summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clock In / Out control */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>Attendance Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <Clock className="w-8 h-8 text-brand-600 animate-pulse mb-2" />
                <span className="text-2xl font-bold text-slate-800">
                  {todayRecord ? (todayRecord.checkOut ? "Checked Out" : "Working...") : "00:00:00"}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  {todayRecord
                    ? `Checked In: ${todayRecord.checkIn} ${todayRecord.checkOut ? `| Checked Out: ${todayRecord.checkOut}` : ""}`
                    : "You haven't checked in yet today."}
                </p>
              </div>
            </CardContent>
          </div>

          <div className="grid grid-cols-2 gap-3 p-6 pt-0">
            <Button
              variant={todayRecord ? "secondary" : "primary"}
              disabled={!!todayRecord}
              onClick={() => checkIn(currentUser.id)}
              className="w-full justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Check In
            </Button>
            <Button
              variant={!todayRecord || todayRecord.checkOut ? "secondary" : "danger"}
              disabled={!todayRecord || !!todayRecord.checkOut}
              onClick={() => checkOut(currentUser.id)}
              className="w-full justify-center gap-2"
            >
              <Square className="w-4 h-4" /> Check Out
            </Button>
          </div>
        </Card>

        {/* Leave Summary */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>Leave Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Available Paid Leaves</span>
                <span className="text-slate-800 font-bold">{leaveBalance} Days</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Pending Leave Requests</span>
                <span className="text-amber-600 font-bold">{pendingLeaves} Requests</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold py-2.5">
                <span className="text-slate-500">Approved Leaves</span>
                <span className="text-emerald-600 font-bold">{approvedLeaves} Requests</span>
              </div>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <Link to="/employee/leave">
              <Button variant="secondary" className="w-full justify-center gap-1">
                Manage Leaves <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Payroll Card summary */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>Payroll Quick Glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LATEST MONTHLY SALARY</p>
                <h3 className="text-2xl font-extrabold text-emerald-800 mt-1">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(latestPay.netSalary)}
                </h3>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/55 rounded px-2 py-0.5 mt-2">
                  Status: Paid ({latestPay.month})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Last salary was credited on {latestPay.paymentDate || "N/A"}.
              </p>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <Link to="/employee/payroll">
              <Button variant="secondary" className="w-full justify-center gap-1">
                View Payslip details <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Attendance Chart & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart title="My Weekly Working Hours Trend" data={chartData} />
        </div>
        <div>
          <RecentActivity activities={sortedActivities} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
