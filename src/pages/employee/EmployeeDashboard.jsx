import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CreditCard,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';

export const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [chartView, setChartView] = useState('weekly');
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attData, leaveData, payData, wTrend, mTrend] = await Promise.all([
          attendanceService.getSummary(),
          leaveService.getBalances(),
          payrollService.getSalarySummary(),
          attendanceService.getWeeklyTrend(),
          attendanceService.getMonthlyTrend(),
        ]);
        setAttendance(attData);
        setLeaves(leaveData);
        setPayroll(payData);
        setWeeklyTrend(wTrend);
        setMonthlyTrend(mTrend);
      } catch (err) {
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const updated = await attendanceService.checkIn();
      setAttendance(updated);
      toast.success('Successfully checked in for today!');
    } catch (err) {
      toast.error('Failed to check in.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const updated = await attendanceService.checkOut();
      setAttendance(updated);
      toast.success('Successfully checked out!');
    } catch (err) {
      toast.error('Failed to check out.');
    } finally {
      setActionLoading(false);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <SkeletonLoader variant="card" className="h-36" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonLoader variant="card" count={4} className="h-28" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" className="lg:col-span-2 h-72" />
            <SkeletonLoader variant="card" className="h-72" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Banner Greeting */}
        <Card className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white border-none shadow-md overflow-hidden relative">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Dayflow Workspace
                </Badge>
                <span className="text-xs text-slate-300">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {getTimeGreeting()}, {currentUser?.fullName || 'Employee'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Here is your daily work activity summary. Keep track of your attendance, leave requests, and payroll updates.
              </p>
            </div>

            {/* Quick Check-in CTA Button */}
            <div className="shrink-0 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs flex flex-col items-center gap-2 text-center min-w-44">
              <span className="text-[11px] uppercase font-semibold text-slate-300">Today's Status</span>
              <Badge variant={attendance?.isCheckedIn ? 'success' : 'neutral'} size="md">
                {attendance?.todayStatus || 'Not Checked In'}
              </Badge>
              {attendance?.isCheckedIn ? (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleCheckOut}
                  isLoading={actionLoading}
                  className="w-full mt-1"
                >
                  Check Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCheckIn}
                  isLoading={actionLoading}
                  className="w-full mt-1"
                >
                  Check In Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-indigo-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{attendance?.todayStatus || 'Present'}</h3>
                <p className="text-[11px] text-emerald-600 font-medium">Checked in at {attendance?.checkInTime}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-indigo-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Days</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{attendance?.presentDays} / {attendance?.totalWorkingDays}</h3>
                <p className="text-[11px] text-slate-500">This Month</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-indigo-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Balance</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{leaves?.paidLeave + leaves?.sickLeave} Days</h3>
                <p className="text-[11px] text-amber-600 font-medium">{leaves?.pendingRequests} pending request</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-indigo-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Salary</p>
                <h3 className="text-2xl font-extrabold text-slate-900">${payroll?.netSalary.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-500">Last paid: {payroll?.lastPaymentDate}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section: Attendance & Quick Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Attendance Trend
                </CardTitle>
                <CardDescription>Track weekly and monthly working hours</CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setChartView('weekly')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    chartView === 'weekly' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setChartView('monthly')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    chartView === 'monthly' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === 'weekly' ? (
                    <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="h" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        formatter={(val) => [`${val} hrs`, 'Work Hours']}
                      />
                      <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  ) : (
                    <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="present" fill="#10b981" name="Present Days" radius={[6, 6, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="absent" fill="#f43f5e" name="Absence/Leave" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Cards Column */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Leave Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span>Leave Overview</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/employee/leave')} className="text-xs text-indigo-600 p-0 hover:bg-transparent">
                    Manage <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Available Leaves</span>
                  <span className="font-bold text-slate-900">{leaves?.paidLeave + leaves?.sickLeave} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Pending Requests</span>
                  <span className="font-bold text-amber-600">{leaves?.pendingRequests} Request</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Approved Leaves</span>
                  <span className="font-bold text-emerald-600">{leaves?.approvedRequests} Days</span>
                </div>
              </CardContent>
            </Card>

            {/* Payroll Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span>Payroll Info</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/employee/payroll')} className="text-xs text-indigo-600 p-0 hover:bg-transparent">
                    View Payslips <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Current Salary</span>
                  <span className="font-bold text-slate-900">${payroll?.netSalary.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Last Payment Date</span>
                  <span className="font-bold text-slate-800">{payroll?.lastPaymentDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" /> Recent Activity History
            </CardTitle>
            <CardDescription>Recent actions and system updates associated with your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">Checked in at 09:05 AM</p>
                  <p className="text-[11px] text-slate-500">Today, August 22, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">Submitted Leave Application for Aug 28 - Aug 29</p>
                  <p className="text-[11px] text-slate-500">August 20, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">Sick Leave Approved by HR Manager</p>
                  <p className="text-[11px] text-slate-500">August 14, 2026</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
