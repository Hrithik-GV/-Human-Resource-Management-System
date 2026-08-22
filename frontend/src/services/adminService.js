import api, { handleApiError } from './api';

const normalizeUser = (user) => ({
  ...user,
  id: user._id,
  fullName: user.name,
  loginId: user.loginId || user.employeeId,
  position: user.designation,
  role: user.role?.toLowerCase(),
  status: 'Active',
  avatar: user.profilePicture,
  mustChangePassword: !!user.mustChangePassword,
  companyName: user.companyName || '',
  companyLogo: user.companyLogo || '',
});

const normalizeAttendance = (record) => ({
  ...record,
  id: record._id,
  name: record.employee?.name,
  fullName: record.employee?.name,
  employeeId: record.employee?.employeeId,
  department: record.employee?.department,
  date: record.date?.slice(0, 10),
});

const normalizeLeave = (leave) => ({
  ...leave,
  id: leave._id,
  name: leave.employee?.name,
  employeeName: leave.employee?.name,
  fullName: leave.employee?.name,
  employeeId: leave.employee?.employeeId,
  startDate: leave.fromDate?.slice(0, 10),
  endDate: leave.toDate?.slice(0, 10),
});

const normalizePayroll = (payroll) => ({
  ...payroll,
  ...normalizeUser(payroll.employee || {}),
  id: payroll._id,
  basicSalary: payroll.basicSalary,
  bonus: payroll.bonus || 0,
  deductions: payroll.deductions || 0,
  salary: payroll.netSalary,
  allowances: 0,
});

const request = async (operation, fallback) => {
  try {
    return await operation();
  } catch (error) {
    throw new Error(handleApiError(error, fallback));
  }
};

export const adminService = {
  getDashboard: () => request(async () => {
    const response = await api.get('/admin/dashboard');
    const stats = response.data.stats;
    return { totalEmployees: stats.totalEmployees, presentToday: stats.presentToday, pendingLeaves: stats.pendingLeaveRequests, monthlyPayroll: 0, departmentDistribution: [], attendanceOverview: [] };
  }, 'Failed to fetch admin dashboard summary'),

  getDashboardSummary: () => adminService.getDashboard(),

  getEmployees: (filters = {}) => request(async () => {
    const params = { ...filters };
    delete params.status;
    if (params.department === 'All') delete params.department;
    const response = await api.get('/admin/users', { params });
    return response.data.users.filter((user) => user.role === 'Employee').map(normalizeUser);
  }, 'Failed to fetch employee list'),

  getEmployee: (id) => request(async () => {
    const response = await api.get(`/admin/users/${id}`);
    return normalizeUser(response.data.user);
  }, 'Failed to fetch employee details'),

  createEmployee: (data) => request(async () => {
    // Calls new admin create-employee endpoint
    const response = await api.post('/admin/create-employee', {
      companyName: data.companyName,
      companyLogo: data.companyLogo,
      name: data.fullName || data.name,
      email: data.email,
      phone: data.phone,
      department: data.department || 'General',
      designation: data.position || data.designation || 'Employee',
      joiningYear: data.joiningYear || new Date().getFullYear(),
    });
    return {
      user: normalizeUser(response.data.user),
      loginId: response.data.loginId,
      temporaryPassword: response.data.temporaryPassword,
    };
  }, 'Failed to create employee'),

  addEmployee: (data) => adminService.createEmployee(data),

  updateEmployee: (_id, _data) => request(async () => {
    if (_data.salary !== undefined || _data.basicSalary !== undefined) {
      const basicSalary = Number(_data.basicSalary || _data.salary || 0);
      const response = await api.put(`/payroll/${_id}`, {
        basicSalary,
        bonus: Number(_data.bonus || 0),
        deductions: Number(_data.deductions || 0),
      });
      return normalizePayroll(response.data.payroll);
    }
    return true;
  }, 'Failed to update employee record'),

  deleteEmployee: (id) => request(async () => {
    await api.delete(`/admin/users/${id}`);
    return true;
  }, 'Failed to delete employee'),

  getAttendanceRecords: (filters = {}) => request(async () => {
    const params = { ...filters };
    if (params.department === 'All') delete params.department;
    if (params.status === 'All') delete params.status;
    const response = await api.get('/attendance/all', { params });
    return response.data.attendance.map(normalizeAttendance);
  }, 'Failed to fetch attendance logs'),

  getLeaveRequests: (filters = {}) => request(async () => {
    const params = filters.status === 'All' ? {} : filters;
    const response = await api.get('/leave/all', { params });
    return response.data.leaves.map(normalizeLeave);
  }, 'Failed to fetch leave requests'),

  approveLeaveRequest: (id) => request(async () => {
    await api.patch(`/leave/${id}`, { status: 'Approved' });
    return true;
  }, 'Leave approval failed'),

  rejectLeaveRequest: (id, reason) => request(async () => {
    await api.patch(`/leave/${id}`, { status: 'Rejected', adminComment: reason });
    return true;
  }, 'Leave rejection failed'),

  getPayrollRecords: (filters = {}) => request(async () => {
    const response = await api.get('/payroll', { params: filters });
    return response.data.payrolls.map(normalizePayroll);
  }, 'Failed to fetch payroll records'),

  updateSalaryStructure: (id, data) => request(async () => {
    const response = await api.put(`/payroll/${id}`, data);
    return normalizePayroll(response.data.payroll);
  }, 'Failed to update salary structure'),
};
