import api, { handleApiError } from './api';
import {
  MOCK_ADMIN_EMPLOYEES,
  MOCK_ADMIN_ATTENDANCE,
  MOCK_ADMIN_LEAVE_REQUESTS,
  MOCK_ADMIN_DEPARTMENT_DISTRIBUTION,
  MOCK_ADMIN_ATTENDANCE_OVERVIEW,
} from '../data/adminData';

let employeesList = [...MOCK_ADMIN_EMPLOYEES];
let attendanceList = [...MOCK_ADMIN_ATTENDANCE];
let leaveRequestsList = [...MOCK_ADMIN_LEAVE_REQUESTS];

export const adminService = {
  getDashboard: async () => {
    try {
      // Future Axios: const response = await api.get('/admin/dashboard'); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          const totalEmployees = employeesList.length;
          const presentToday = attendanceList.filter((a) => a.status === 'Present').length;
          const pendingLeaves = leaveRequestsList.filter((l) => l.status === 'Pending').length;
          const monthlyPayroll = employeesList.reduce((acc, emp) => acc + (emp.salary || 0), 0);

          resolve({
            totalEmployees,
            presentToday,
            pendingLeaves,
            monthlyPayroll,
            departmentDistribution: MOCK_ADMIN_DEPARTMENT_DISTRIBUTION,
            attendanceOverview: MOCK_ADMIN_ATTENDANCE_OVERVIEW,
          });
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch admin dashboard summary'));
    }
  },

  getDashboardSummary: async () => {
    return adminService.getDashboard();
  },

  getEmployees: async (filters = {}) => {
    try {
      // Future Axios: const response = await api.get('/admin/employees', { params: filters }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...employeesList];
          if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
              (e) =>
                e.fullName.toLowerCase().includes(q) ||
                e.email.toLowerCase().includes(q) ||
                e.employeeId.toLowerCase().includes(q)
            );
          }
          if (filters.department && filters.department !== 'All') {
            filtered = filtered.filter((e) => e.department === filters.department);
          }
          if (filters.status && filters.status !== 'All') {
            filtered = filtered.filter((e) => e.status === filters.status);
          }
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch employee list'));
    }
  },

  getEmployee: async (id) => {
    try {
      // Future Axios: const response = await api.get(`/admin/employees/${id}`); return response.data;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const found = employeesList.find((e) => e.id === id || e.employeeId === id);
          if (found) resolve(found);
          else reject(new Error('Employee not found'));
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch employee details'));
    }
  },

  createEmployee: async (newEmpData) => {
    try {
      // Future Axios: const response = await api.post('/admin/employees', newEmpData); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          const newRecord = {
            id: newEmpData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
            employeeId: newEmpData.employeeId,
            fullName: newEmpData.fullName,
            email: newEmpData.email,
            phone: newEmpData.phone || '+1 (555) 000-0000',
            department: newEmpData.department || 'Engineering',
            position: newEmpData.position || 'Software Developer',
            role: 'employee',
            status: newEmpData.status || 'Active',
            salary: Number(newEmpData.salary) || 7500,
            basicSalary: Math.round((Number(newEmpData.salary) || 7500) * 0.8),
            bonus: 500,
            allowances: 1000,
            deductions: 400,
            joiningDate: newEmpData.joiningDate || new Date().toISOString().split('T')[0],
            avatar: newEmpData.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`,
          };
          employeesList = [newRecord, ...employeesList];
          resolve(newRecord);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create employee'));
    }
  },

  addEmployee: async (data) => {
    return adminService.createEmployee(data);
  },

  updateEmployee: async (id, updatedData) => {
    try {
      // Future Axios: const response = await api.put(`/admin/employees/${id}`, updatedData); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          employeesList = employeesList.map((e) => {
            if (e.id === id || e.employeeId === id) {
              return { ...e, ...updatedData };
            }
            return e;
          });
          const updated = employeesList.find((e) => e.id === id || e.employeeId === id);
          resolve(updated);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update employee'));
    }
  },

  deleteEmployee: async (id) => {
    try {
      // Future Axios: const response = await api.delete(`/admin/employees/${id}`); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          employeesList = employeesList.filter((e) => e.id !== id && e.employeeId !== id);
          resolve(true);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete employee'));
    }
  },

  getAttendanceRecords: async (filters = {}) => {
    try {
      // Future Axios: const response = await api.get('/admin/attendance', { params: filters }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...attendanceList];
          if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
              (a) => a.name.toLowerCase().includes(q) || a.employeeId.toLowerCase().includes(q)
            );
          }
          if (filters.department && filters.department !== 'All') {
            filtered = filtered.filter((a) => a.department === filters.department);
          }
          if (filters.status && filters.status !== 'All') {
            filtered = filtered.filter((a) => a.status === filters.status);
          }
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch attendance logs'));
    }
  },

  getLeaveRequests: async (filters = {}) => {
    try {
      // Future Axios: const response = await api.get('/admin/leave-requests', { params: filters }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...leaveRequestsList];
          if (filters.status && filters.status !== 'All') {
            filtered = filtered.filter((l) => l.status === filters.status);
          }
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch leave requests'));
    }
  },

  approveLeaveRequest: async (id) => {
    try {
      // Future Axios: const response = await api.patch(`/admin/leave-requests/${id}/approve`); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          leaveRequestsList = leaveRequestsList.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l));
          resolve(true);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Leave approval failed'));
    }
  },

  rejectLeaveRequest: async (id, reason) => {
    try {
      // Future Axios: const response = await api.patch(`/admin/leave-requests/${id}/reject`, { reason }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          leaveRequestsList = leaveRequestsList.map((l) => (l.id === id ? { ...l, status: 'Rejected', rejectionReason: reason } : l));
          resolve(true);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Leave rejection failed'));
    }
  },

  getPayrollRecords: async (filters = {}) => {
    try {
      // Future Axios: const response = await api.get('/admin/payroll', { params: filters }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...employeesList];
          if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
              (e) => e.fullName.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
            );
          }
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch payroll records'));
    }
  },

  updateSalaryStructure: async (id, salaryData) => {
    try {
      // Future Axios: const response = await api.put(`/admin/payroll/${id}`, salaryData); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          const basic = Number(salaryData.basicSalary) || 0;
          const bonus = Number(salaryData.bonus) || 0;
          const allowances = Number(salaryData.allowances) || 0;
          const deductions = Number(salaryData.deductions) || 0;
          const net = basic + bonus + allowances - deductions;

          employeesList = employeesList.map((e) => {
            if (e.id === id || e.employeeId === id) {
              return {
                ...e,
                basicSalary: basic,
                bonus,
                allowances,
                deductions,
                salary: net,
              };
            }
            return e;
          });
          resolve(true);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update salary structure'));
    }
  },
};
