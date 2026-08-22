import api, { handleApiError } from './api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const normalizeRecord = (record) => {
  const date = new Date(record.date);
  return {
    ...record,
    id: record._id,
    date: record.date?.slice(0, 10),
    day: date.toLocaleDateString('en-US', { weekday: 'long' }),
    checkIn: record.checkIn
      ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '-',
    checkOut: record.checkOut
      ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '-',
    hours:
      record.checkIn && record.checkOut
        ? ((new Date(record.checkOut) - new Date(record.checkIn)) / 3600000).toFixed(2)
        : '0',
  };
};

const getSummary = (records) => {
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((record) => record.date === today);
  return {
    presentDays: records.filter((record) => record.status === 'Present').length,
    absentDays: records.filter((record) => record.status === 'Absent').length,
    halfDays: records.filter((record) => record.status === 'Half Day').length,
    leaveDays: records.filter((record) => record.status === 'Leave').length,
    totalWorkingDays: records.length,
    checkInTime: todayRecord?.checkIn || '-',
    checkOutTime: todayRecord?.checkOut || '-',
    todayStatus: todayRecord?.status || 'Absent',
    // isCheckedIn = today's record exists with a checkIn time but no checkOut time
    isCheckedIn: Boolean(todayRecord?.checkIn && todayRecord.checkIn !== '-' && (!todayRecord?.checkOut || todayRecord.checkOut === '-')),
  };
};

export const attendanceService = {
  getSummary: async () => {
    try {
      const response = await api.get('/attendance/my');
      return getSummary(response.data.attendance.map(normalizeRecord));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch summary'));
    }
  },

  getMyAttendance: async (filters = {}) => {
    try {
      const response = await api.get('/attendance/my', { params: filters });
      return response.data.attendance.map(normalizeRecord);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch my attendance logs'));
    }
  },

  getAllAttendance: async (filters = {}) => {
    try {
      const response = await api.get('/attendance/all', { params: filters });
      return response.data.attendance.map(normalizeRecord);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch attendance records'));
    }
  },

  getLogs: async (filters = {}) => {
    return attendanceService.getMyAttendance(filters);
  },

  getWeeklyTrend: async () => {
    try {
      const records = await attendanceService.getMyAttendance();
      return records
        .slice(0, 5)
        .reverse()
        .map((record) => ({ name: record.day.slice(0, 3), hours: Number(record.hours) || 0 }));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch weekly trends'));
    }
  },

  getMonthlyTrend: async () => {
    try {
      const records = await attendanceService.getMyAttendance();
      return records.reduce((trend, record) => {
        const week = `Week ${Math.ceil(new Date(record.date).getDate() / 7)}`;
        const item = trend.find((entry) => entry.name === week) || {
          name: week,
          present: 0,
          absent: 0,
        };
        item[record.status === 'Present' ? 'present' : 'absent'] += 1;
        if (!trend.includes(item)) trend.push(item);
        return trend;
      }, []);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch monthly trends'));
    }
  },

  // After check-in, refetch all attendance records to compute accurate summary
  checkIn: async () => {
    try {
      await api.post('/attendance/checkin');
      const response = await api.get('/attendance/my');
      return getSummary(response.data.attendance.map(normalizeRecord));
    } catch (error) {
      throw new Error(handleApiError(error, 'Check-in failed'));
    }
  },

  // After check-out, refetch all attendance records
  checkOut: async () => {
    try {
      await api.post('/attendance/checkout');
      const response = await api.get('/attendance/my');
      return getSummary(response.data.attendance.map(normalizeRecord));
    } catch (error) {
      throw new Error(handleApiError(error, 'Check-out failed'));
    }
  },
};
