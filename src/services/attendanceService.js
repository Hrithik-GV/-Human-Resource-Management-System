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
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...currentSummary }), 300);
    });
  },

  getLogs: async (filters = {}) => {
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
  },

  getWeeklyTrend: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_ATTENDANCE_WEEKLY_TREND]), 200);
    });
  },

  getMonthlyTrend: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_ATTENDANCE_MONTHLY_TREND]), 200);
    });
  },

  checkIn: async () => {
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
      }, 400);
    });
  },

  checkOut: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        currentSummary = {
          ...currentSummary,
          isCheckedIn: false,
          checkOutTime: timeStr,
        };
        resolve({ ...currentSummary });
      }, 400);
    });
  },
};
