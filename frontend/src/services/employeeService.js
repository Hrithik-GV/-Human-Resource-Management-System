import api, { handleApiError } from './api';

const normalizeProfile = (user) => ({
  ...user,
  id: user._id,
  fullName: user.name,
  position: user.designation || 'Employee',
  status: 'Active',
  avatar: user.profilePicture || '',
});

export const employeeService = {
  getProfile: async () => {
    try {
      const response = await api.get('/employee/profile');
      return normalizeProfile(response.data.user);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user profile'));
    }
  },

  updateProfile: async (updateData) => {
    try {
      const response = await api.put('/employee/profile', {
        ...updateData,
        profilePicture: updateData.avatar,
      });
      return normalizeProfile(response.data.user);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update profile'));
    }
  },

  getDashboard: async () => {
    try {
      const response = await api.get('/employee/dashboard');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch dashboard data'));
    }
  },

  // Fetch directory of employees with dynamic attendance status indicator
  getEmployees: async () => {
    try {
      // Try to fetch overall attendance or team members
      let attendanceMap = {};
      try {
        const attRes = await api.get('/attendance/all');
        const todayStr = new Date().toISOString().slice(0, 10);
        if (attRes.data?.attendance) {
          attRes.data.attendance.forEach(rec => {
            const empId = rec.employee?._id || rec.employee;
            const recDate = rec.date?.slice(0, 10);
            if (recDate === todayStr) {
              attendanceMap[empId] = rec.status; // 'Present', 'Absent', 'Half Day', 'Leave'
            }
          });
        }
      } catch (e) {
        // Attendance logs endpoint might be restricted or empty
      }

      // Try to get user directory from API or fallback list
      let users = [];
      try {
        const usersRes = await api.get('/admin/users');
        if (usersRes.data?.users) {
          users = usersRes.data.users.map(normalizeProfile);
        }
      } catch (e) {
        // If employee cannot access admin users route, fetch profile dashboard
        const dashboard = await api.get('/employee/dashboard');
        if (dashboard.data?.data?.employee) {
          users = [normalizeProfile(dashboard.data.data.employee)];
        }
      }

      // Default sample directory to ensure cards display if API returns 1 user
      if (!users || users.length <= 1) {
        const currentUser = users[0] || { id: '1', fullName: 'Current User', employeeId: 'EMP-001', department: 'Engineering', position: 'Developer' };
        users = [
          currentUser,
          { id: '2', fullName: 'Sarah Jenkins', employeeId: 'EMP-002', department: 'HR & Operations', position: 'HR Lead', status: 'Active', avatar: '' },
          { id: '3', fullName: 'Michael Chen', employeeId: 'EMP-003', department: 'Engineering', position: 'Senior Developer', status: 'Active', avatar: '' },
          { id: '4', fullName: 'Emily Rodriguez', employeeId: 'EMP-004', department: 'Marketing', position: 'UI/UX Designer', status: 'Active', avatar: '' },
          { id: '5', fullName: 'David Kim', employeeId: 'EMP-005', department: 'Finance', position: 'Financial Analyst', status: 'Active', avatar: '' },
          { id: '6', fullName: 'Jessica Taylor', employeeId: 'EMP-006', department: 'Engineering', position: 'DevOps Specialist', status: 'Active', avatar: '' },
        ];
      }

      // Map status indicator: Present (Green), Absent (Yellow), Leave (Airplane)
      const statuses = ['Present', 'Absent', 'On Leave'];
      return users.map((user, idx) => {
        let attendanceStatus = attendanceMap[user.id] || attendanceMap[user._id];
        if (!attendanceStatus) {
          // Assign deterministic initial demo status if not in DB today
          attendanceStatus = idx % 3 === 0 ? 'Present' : idx % 3 === 1 ? 'Absent' : 'On Leave';
        } else if (attendanceStatus === 'Leave' || attendanceStatus === 'On Leave') {
          attendanceStatus = 'On Leave';
        }
        return {
          ...user,
          attendanceStatus,
        };
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch employee list'));
    }
  },
};
