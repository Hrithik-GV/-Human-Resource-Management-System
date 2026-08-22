import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CreditCard,
  UserCheck,
  Search,
  Plane,
  Building,
  IdCard,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  User,
  Users,
  CalendarDays,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const resolveAvatar = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/${path}`;
};

export const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');

  // View-Only Profile Modal state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [attSummary, leaveBalances, salarySummary, employeeList] = await Promise.all([
        attendanceService.getSummary(),
        leaveService.getBalances().catch(() => ({ paidLeave: 12, sickLeave: 6, pendingRequests: 0 })),
        payrollService.getSalarySummary().catch(() => null),
        employeeService.getEmployees().catch(() => []),
      ]);

      setAttendance(attSummary);
      setLeaves(leaveBalances);
      setPayroll(salarySummary);
      setEmployees(employeeList);
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Check-In Handler
  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const updatedAtt = await attendanceService.checkIn();
      setAttendance(updatedAtt);

      // Update current user's card in employee grid dynamically to Green (Present)
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === currentUser?.id || emp.email === currentUser?.email
            ? { ...emp, attendanceStatus: 'Present' }
            : emp
        )
      );
      toast.success('Successfully checked in for today!');
    } catch (err) {
      toast.error(err.message || 'Failed to check in.');
    } finally {
      setActionLoading(false);
    }
  };

  // Check-Out Handler
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const updatedAtt = await attendanceService.checkOut();
      setAttendance(updatedAtt);
      toast.success('Successfully checked out!');
    } catch (err) {
      toast.error(err.message || 'Failed to check out.');
    } finally {
      setActionLoading(false);
    }
  };

  // Card Click Handler -> Opens Profile in View-Only mode
  const handleCardClick = (emp) => {
    setSelectedEmployee(emp);
    setIsViewModalOpen(true);
  };

  // Instant Search Filtering by Name or Employee ID
  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = emp.fullName?.toLowerCase().includes(q) || emp.name?.toLowerCase().includes(q);
    const idMatch = emp.employeeId?.toLowerCase().includes(q) || emp.loginId?.toLowerCase().includes(q);
    const deptMatch = emp.department?.toLowerCase().includes(q);
    return nameMatch || idMatch || deptMatch;
  });

  // Render Status Indicator for Card Top-Right Corner
  const renderStatusIndicator = (status) => {
    if (status === 'Present') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Present
        </span>
      );
    }
    if (status === 'On Leave' || status === 'Leave') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 shadow-2xs">
          <Plane className="w-3 h-3 text-sky-500" />
          On Leave
        </span>
      );
    }
    // Default: Yellow Dot for Absent
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        Absent
      </span>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <SkeletonLoader variant="card" className="h-32" />
          <SkeletonLoader variant="card" className="h-24" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SkeletonLoader variant="card" count={8} className="h-44" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const isCheckedIn = Boolean(attendance?.isCheckedIn);
  const isCheckedOut = Boolean(attendance?.checkOutTime && attendance?.checkOutTime !== '-');

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'employees'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" /> Employees
            </button>
            <button
              onClick={() => {
                setActiveTab('attendance');
                navigate('/employee/attendance');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'attendance'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" /> Attendance
            </button>
            <button
              onClick={() => {
                setActiveTab('timeoff');
                navigate('/employee/leave');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'timeoff'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Time Off
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium px-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Welcome, <strong className="text-slate-800">{currentUser?.fullName || 'Employee'}</strong></span>
          </div>
        </div>

        {/* Floating Check-In / Check-Out Widget */}
        <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-md overflow-hidden relative">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Badge variant="primary" size="sm" className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30">
                  <Clock className="w-3.5 h-3.5 mr-1" /> Daily Attendance Widget
                </Badge>
                <span className="text-xs text-slate-300 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {isCheckedIn ? 'You are currently Checked In' : isCheckedOut ? 'Workday Completed' : 'Ready to start your workday?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {isCheckedIn
                  ? `Checked in at ${attendance?.checkInTime}. Remember to check out at the end of your shift.`
                  : isCheckedOut
                  ? `Checked out at ${attendance?.checkOutTime}. Total hours recorded: ${attendance?.hours || 0} hrs.`
                  : 'Click the Check-In button to record your attendance for today.'}
              </p>
            </div>

            {/* Check-In / Check-Out Action Buttons */}
            <div className="shrink-0 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs flex flex-col items-center gap-3 text-center min-w-52">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-300">Status:</span>
                {isCheckedIn ? (
                  <Badge variant="success" size="md">Present</Badge>
                ) : isCheckedOut ? (
                  <Badge variant="neutral" size="md">Completed</Badge>
                ) : (
                  <Badge variant="warning" size="md">Not Checked In</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 w-full">
                {!isCheckedIn && !isCheckedOut && (
                  <Button
                    size="md"
                    variant="primary"
                    onClick={handleCheckIn}
                    isLoading={actionLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Check In
                  </Button>
                )}

                {isCheckedIn && (
                  <Button
                    size="md"
                    variant="danger"
                    onClick={handleCheckOut}
                    isLoading={actionLoading}
                    className="w-full font-bold shadow-md"
                  >
                    Check Out
                  </Button>
                )}

                {isCheckedOut && (
                  <Button
                    size="md"
                    variant="secondary"
                    disabled
                    className="w-full font-bold opacity-80 cursor-not-allowed"
                  >
                    Checked Out ({attendance?.checkOutTime})
                  </Button>
                )}
              </div>

              {attendance?.checkInTime && attendance?.checkInTime !== '-' && (
                <div className="text-[11px] text-slate-300 font-medium">
                  Check-in Time: <strong className="text-white">{attendance.checkInTime}</strong>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Directory Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Team Directory ({filteredEmployees.length})
            </h3>
            <p className="text-xs text-slate-500">View team members and their live attendance status indicator</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-12 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Employee Cards Grid */}
        {filteredEmployees.length === 0 ? (
          <Card className="p-8 text-center bg-slate-50/50 border-dashed">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No employees found</h4>
            <p className="text-xs text-slate-400">Try adjusting your search criteria</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEmployees.map((emp) => (
              <Card
                key={emp.id || emp._id}
                onClick={() => handleCardClick(emp)}
                className="group relative cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all duration-200 bg-white overflow-hidden border border-slate-200"
              >
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  {/* Top-Right Attendance Status Indicator */}
                  <div className="absolute top-3 right-3">
                    {renderStatusIndicator(emp.attendanceStatus)}
                  </div>

                  {/* Profile Avatar */}
                  <div className="pt-2">
                    <Avatar
                      src={resolveAvatar(emp.avatar || emp.profilePicture)}
                      name={emp.fullName || emp.name}
                      size="lg"
                      className="ring-4 ring-indigo-50 group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Employee Info */}
                  <div className="space-y-1 w-full">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {emp.fullName || emp.name}
                    </h4>
                    <p className="text-xs font-semibold text-indigo-600 truncate">
                      {emp.position || emp.designation || 'Employee'}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-mono font-medium">
                        <IdCard className="w-3.5 h-3.5 text-slate-400" />
                        {emp.employeeId || emp.loginId || 'EMP-001'}
                      </span>
                    </div>
                    {emp.department && (
                      <p className="text-[11px] text-slate-400 truncate flex items-center justify-center gap-1 pt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        {emp.department}
                      </p>
                    )}
                  </div>

                  <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-indigo-600 font-semibold group-hover:underline">
                    <Eye className="w-3.5 h-3.5" /> View Profile
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View-Only Employee Profile Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Employee Profile Details"
          description="View employee profile information (Read Only)"
        >
          {selectedEmployee && (
            <div className="space-y-5">
              {/* Notice Banner */}
              <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-lg flex items-center gap-2 text-xs text-indigo-800">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>View Only Mode:</strong> You cannot edit another employee's profile.</span>
              </div>

              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <Avatar
                  src={resolveAvatar(selectedEmployee.avatar || selectedEmployee.profilePicture)}
                  name={selectedEmployee.fullName || selectedEmployee.name}
                  size="xl"
                  className="ring-2 ring-white shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{selectedEmployee.fullName || selectedEmployee.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600">{selectedEmployee.position || selectedEmployee.designation || 'Employee'}</p>
                  <div className="flex items-center gap-2 pt-1">
                    {renderStatusIndicator(selectedEmployee.attendanceStatus)}
                    <Badge variant="primary" size="sm" className="capitalize">
                      {selectedEmployee.department || 'Department'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Employee ID</span>
                  <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                    <IdCard className="w-3.5 h-3.5 text-indigo-500" /> {selectedEmployee.employeeId || selectedEmployee.loginId}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Department</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-indigo-500" /> {selectedEmployee.department || 'Human Resources'}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Email Address</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 truncate">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> {selectedEmployee.email || 'employee@dayflow.com'}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Phone Number</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" /> {selectedEmployee.phone || '+1 (555) 000-0000'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button variant="outline" size="md" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageContainer>
  );
};
