import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  UserX,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  TrendingUp
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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { attendanceService } from '../../services/attendanceService';

export const EmployeeAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumData, logData, trendData] = await Promise.all([
        attendanceService.getSummary(),
        attendanceService.getLogs({ search: searchQuery }),
        attendanceService.getWeeklyTrend(),
      ]);
      setSummary(sumData);
      setLogs(logData);
      setWeeklyTrend(trendData);
    } catch (err) {
      toast.error('Failed to load attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const updated = await attendanceService.checkIn();
      setSummary(updated);
      toast.success('Checked in successfully!');
      fetchData();
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
      setSummary(updated);
      toast.success('Checked out successfully!');
      fetchData();
    } catch (err) {
      toast.error('Failed to check out.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Absent':
        return 'error';
      case 'Half Day':
        return 'warning';
      case 'Leave':
        return 'info';
      default:
        return 'neutral';
    }
  };

  if (loading && logs.length === 0) {
    return (
      <PageContainer title="My Attendance" description="Track daily check-ins, working hours, and monthly attendance logs.">
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <SkeletonLoader variant="card" count={5} className="h-24" />
          </div>
          <SkeletonLoader variant="card" className="h-80" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="My Attendance"
      description="Track daily check-ins, working hours, and monthly attendance logs."
      actions={
        <div className="flex items-center gap-2">
          {summary?.isCheckedIn ? (
            <Button variant="danger" size="md" onClick={handleCheckOut} isLoading={actionLoading}>
              Check Out
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleCheckIn} isLoading={actionLoading}>
              Check In
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="hover:border-emerald-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Present</p>
                <h3 className="text-xl font-bold text-slate-900">{summary?.presentDays} Days</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-rose-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Absent</p>
                <h3 className="text-xl font-bold text-slate-900">{summary?.absentDays} Days</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <UserX className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-amber-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Half Day</p>
                <h3 className="text-xl font-bold text-slate-900">{summary?.halfDays} Days</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-sky-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Leave</p>
                <h3 className="text-xl font-bold text-slate-900">{summary?.leaveDays} Days</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1 hover:border-indigo-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Days</p>
                <h3 className="text-xl font-bold text-slate-900">{summary?.totalWorkingDays} Days</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Chart Visualizer */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Weekly Work Hours
            </CardTitle>
            <CardDescription>Daily work hour breakdown for current week</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="h" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val) => [`${val} hrs`, 'Hours Worked']} />
                  <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table & Filters */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Attendance Logs</CardTitle>
              <CardDescription>Comprehensive daily attendance records</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter date or status..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {logs.length === 0 ? (
              <EmptyState title="No Attendance Logs Found" description="No records matched your search query." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-semibold text-slate-900">{row.date}</TableCell>
                      <TableCell>{row.day}</TableCell>
                      <TableCell>{row.checkIn}</TableCell>
                      <TableCell>{row.checkOut}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{row.hours}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(row.status)} dot size="sm">
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
