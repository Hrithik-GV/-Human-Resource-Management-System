import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  FileCheck,
  CreditCard,
  Plus,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardSummary();
      setData(res);
    } catch (err) {
      toast.error('Failed to load admin dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Admin Dashboard" description="System overview and workforce management metrics.">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonLoader variant="card" count={4} className="h-28" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader variant="card" className="h-80" />
            <SkeletonLoader variant="card" className="h-80" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Admin Dashboard"
      description="System overview, workforce analytics, and administrative management shortcuts."
      actions={
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/admin/employees')}
        >
          Add New Employee
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/80 text-slate-900 border border-indigo-100 shadow-2xs overflow-hidden relative">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                  <Shield className="w-3.5 h-3.5 mr-1" /> HR Command Center
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back, {currentUser?.fullName || 'Administrator'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Dayflow HR portal is active. You have {data?.pendingLeaves} pending leave requests waiting for your approval.
              </p>
            </div>

            {/* Quick Stats Banner Pill */}
            <div className="shrink-0 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Total Workforce</span>
                <span className="text-xl font-extrabold text-slate-900">{data?.totalEmployees} Staff</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Present Today</span>
                <span className="text-xl font-extrabold text-emerald-600">{data?.presentToday} Present</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-indigo-300 transition-all cursor-pointer" onClick={() => navigate('/admin/employees')}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{data?.totalEmployees}</h3>
                <p className="text-[11px] text-slate-500">Across 5 Departments</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-300 transition-all cursor-pointer" onClick={() => navigate('/admin/attendance')}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{data?.presentToday} / {data?.totalEmployees}</h3>
                <p className="text-[11px] text-emerald-600 font-medium">{Math.round((data?.presentToday / data?.totalEmployees) * 100)}% Attendance Rate</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-amber-300 transition-all cursor-pointer" onClick={() => navigate('/admin/leaves')}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Leaves</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{data?.pendingLeaves} Requests</h3>
                <p className="text-[11px] text-amber-600 font-medium">Requires Approval</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-sky-300 transition-all cursor-pointer" onClick={() => navigate('/admin/payroll')}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Payroll</p>
                <h3 className="text-2xl font-extrabold text-slate-900">${data?.monthlyPayroll.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-500">Estimated Total Payout</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Shortcuts */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">Quick Administrative Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:border-indigo-300 cursor-pointer group" onClick={() => navigate('/admin/employees')}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">Employee Directory</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-300 cursor-pointer group" onClick={() => navigate('/admin/attendance')}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">View Attendance</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>

            <Card className="hover:border-amber-300 cursor-pointer group" onClick={() => navigate('/admin/leaves')}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-600">Review Leave Requests</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>

            <Card className="hover:border-sky-300 cursor-pointer group" onClick={() => navigate('/admin/payroll')}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600">Manage Payroll</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Overview Bar Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Attendance Overview
              </CardTitle>
              <CardDescription>Daily staff presence, absence, and leave breakdown</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.attendanceOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                    <Bar dataKey="present" fill="#10b981" name="Present" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="absent" fill="#f43f5e" name="Absent" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="leave" fill="#3b82f6" name="Leave" radius={[6, 6, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution Pie Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" /> Department Distribution
              </CardTitle>
              <CardDescription>Employee headcount ratio by department</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.departmentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {data?.departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit & Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" /> Administrative Audit Feed
            </CardTitle>
            <CardDescription>Real-time system events, leave applications, and personnel updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">Sarah Jenkins submitted a Paid Leave application (Aug 28 - Aug 29)</p>
                  <p className="text-[11px] text-slate-500">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">Sophia Martinez's Sick Leave request was approved</p>
                  <p className="text-[11px] text-slate-500">1 hour ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">New Employee record created for Olivia Brown (Design Department)</p>
                  <p className="text-[11px] text-slate-500">Yesterday at 4:30 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
