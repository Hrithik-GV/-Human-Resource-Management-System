import api, { handleApiError } from './api';
import {
  MOCK_ATTENDANCE_SUMMARY,
  MOCK_ATTENDANCE_LOGS,
  MOCK_ATTENDANCE_WEEKLY_TREND,
  MOCK_ATTENDANCE_MONTHLY_TREND,
} from '../data/attendance';

let currentSummary = { ...MOCK_ATTENDANCE_SUMMARY };
let currentLogs = [...MOCK_ATTENDANCE_LOGS];

export const attendanceService = {
  getSummary: async () => {
    try {
      return new Promise((resolve) => setTimeout(() => resolve({ ...currentSummary }), 300));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch summary'));
    }
  },

  getMyAttendance: async (filters = {}) => {
    try {
      // Future Axios: const response = await api.get('/attendance/me', { params: filters }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...currentLogs];
          if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
              (log) =>
                log.date.includes(q) ||
                log.day.toLowerCase().includes(q) ||
                log.status.toLowerCase().includes(q)
            );
          }
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch my attendance logs'));
    }
  },

  getAllAttendance: async (filters = {}) => {
    try {
      // Future Axios: const response = await api.get('/attendance/all', { params: filters }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => resolve([...currentLogs]), 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch attendance records'));
    }
  },

  getLogs: async (filters = {}) => {
    return attendanceService.getMyAttendance(filters);
  },

  getWeeklyTrend: async () => {
    try {
      return new Promise((resolve) => setTimeout(() => resolve([...MOCK_ATTENDANCE_WEEKLY_TREND]), 200));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch weekly trends'));
    }
  },

  getMonthlyTrend: async () => {
    try {
      return new Promise((resolve) => setTimeout(() => resolve([...MOCK_ATTENDANCE_MONTHLY_TREND]), 200));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch monthly trends'));
    }
  },

  checkIn: async () => {
    try {
      // Future Axios: const response = await api.post('/attendance/check-in'); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          currentSummary = {
            ...currentSummary,
            isCheckedIn: true,
            checkInTime: timeStr,
            todayStatus: 'Present',
          };
          resolve({ ...currentSummary });
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Check-in failed'));
    }
  },

  checkOut: async () => {
    try {
      // Future Axios: const response = await api.post('/attendance/check-out'); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          currentSummary = {
            ...currentSummary,
            isCheckedIn: false,
            checkOutTime: timeStr,
          };
          resolve({ ...currentSummary });
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Check-out failed'));
    }
  },
};
