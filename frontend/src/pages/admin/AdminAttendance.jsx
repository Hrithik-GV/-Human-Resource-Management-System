import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, Calendar, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminService } from '../../services/adminService';

export const AdminAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAttendance();
  }, [search, deptFilter, statusFilter]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAttendanceRecords({
        search,
        department: deptFilter,
        status: statusFilter,
      });
      setRecords(data);
    } catch (err) {
      toast.error('Failed to load attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const halfDayCount = records.filter((r) => r.status === 'Half Day').length;
  const leaveCount = records.filter((r) => r.status === 'Leave').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <Badge variant="success" dot size="sm">Present</Badge>;
      case 'Absent':
        return <Badge variant="error" dot size="sm">Absent</Badge>;
      case 'Half Day':
        return <Badge variant="warning" dot size="sm">Half Day</Badge>;
      case 'Leave':
        return <Badge variant="info" dot size="sm">Leave</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <PageContainer
      title="Attendance Management"
      description="Monitor real-time company-wide daily attendance logs and work hours."
    >
      <div className="space-y-6">
        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="hover:border-emerald-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Present</p>
                <h3 className="text-xl font-bold text-slate-900">{presentCount} Staff</h3>
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
                <h3 className="text-xl font-bold text-slate-900">{absentCount} Staff</h3>
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
                <h3 className="text-xl font-bold text-slate-900">{halfDayCount} Staff</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-sky-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">On Leave</p>
                <h3 className="text-xl font-bold text-slate-900">{leaveCount} Staff</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Daily Attendance Register</CardTitle>
              <CardDescription>Comprehensive daily attendance records across all departments</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee or ID..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="w-full sm:w-40">
                <Select
                  options={[
                    { label: 'All Departments', value: 'All' },
                    { label: 'Engineering', value: 'Engineering' },
                    { label: 'Human Resources', value: 'Human Resources' },
                    { label: 'Design', value: 'Design' },
                    { label: 'Marketing', value: 'Marketing' },
                    { label: 'Finance', value: 'Finance' },
                  ]}
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                />
              </div>

              <div className="w-full sm:w-36">
                <Select
                  options={[
                    { label: 'All Statuses', value: 'All' },
                    { label: 'Present', value: 'Present' },
                    { label: 'Absent', value: 'Absent' },
                    { label: 'Half Day', value: 'Half Day' },
                    { label: 'Leave', value: 'Leave' },
                  ]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <SkeletonLoader variant="rectangular" className="h-48" />
              </div>
            ) : records.length === 0 ? (
              <EmptyState title="No Attendance Logs Found" description="No attendance records matched your filter criteria." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{row.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{row.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell className="font-medium text-slate-800">{row.date}</TableCell>
                      <TableCell>{row.checkIn}</TableCell>
                      <TableCell>{row.checkOut}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{row.hours}</TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
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
