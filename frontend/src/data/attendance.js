export const MOCK_ATTENDANCE_SUMMARY = {
  presentDays: 18,
  absentDays: 1,
  halfDays: 1,
  leaveDays: 2,
  totalWorkingDays: 22,
  checkInTime: '09:05 AM',
  checkOutTime: '06:15 PM',
  todayStatus: 'Present',
  isCheckedIn: true,
};

export const MOCK_ATTENDANCE_LOGS = [
  { id: 1, date: '2026-08-22', day: 'Friday', checkIn: '09:05 AM', checkOut: '06:15 PM', hours: '9h 10m', status: 'Present' },
  { id: 2, date: '2026-08-21', day: 'Thursday', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
  { id: 3, date: '2026-08-20', day: 'Wednesday', checkIn: '09:12 AM', checkOut: '06:05 PM', hours: '8h 53m', status: 'Present' },
  { id: 4, date: '2026-08-19', day: 'Tuesday', checkIn: '09:30 AM', checkOut: '02:00 PM', hours: '4h 30m', status: 'Half Day' },
  { id: 5, date: '2026-08-18', day: 'Monday', checkIn: '08:55 AM', checkOut: '06:10 PM', hours: '9h 15m', status: 'Present' },
  { id: 6, date: '2026-08-15', day: 'Friday', checkIn: '09:02 AM', checkOut: '06:00 PM', hours: '8h 58m', status: 'Present' },
  { id: 7, date: '2026-08-14', day: 'Thursday', checkIn: '—', checkOut: '—', hours: '0h', status: 'Leave' },
  { id: 8, date: '2026-08-13', day: 'Wednesday', checkIn: '08:58 AM', checkOut: '06:12 PM', hours: '9h 14m', status: 'Present' },
  { id: 9, date: '2026-08-12', day: 'Tuesday', checkIn: '09:10 AM', checkOut: '06:05 PM', hours: '8h 55m', status: 'Present' },
  { id: 10, date: '2026-08-11', day: 'Monday', checkIn: '—', checkOut: '—', hours: '0h', status: 'Absent' },
];

export const MOCK_ATTENDANCE_WEEKLY_TREND = [
  { name: 'Mon', hours: 9.25 },
  { name: 'Tue', hours: 4.5 },
  { name: 'Wed', hours: 8.88 },
  { name: 'Thu', hours: 9.0 },
  { name: 'Fri', hours: 9.16 },
];

export const MOCK_ATTENDANCE_MONTHLY_TREND = [
  { name: 'Week 1', present: 5, absent: 0 },
  { name: 'Week 2', present: 4, absent: 1 },
  { name: 'Week 3', present: 4, absent: 1 },
  { name: 'Week 4', present: 5, absent: 0 },
];
