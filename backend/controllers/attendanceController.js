import asyncHandler from '../utils/asyncHandler.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// Helper function to calculate start and end of day
const getDayBounds = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);

  const end = new Date(d);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// @desc    Employee check-in for today
// @route   POST /api/attendance/checkin
// @access  Private / Employee
export const checkIn = asyncHandler(async (req, res) => {
  const { start: todayStart, end: todayEnd } = getDayBounds();

  // Check if user has already checked in today
  const existingAttendance = await Attendance.findOne({
    employee: req.user._id,
    date: { $gte: todayStart, $lte: todayEnd },
  });

  if (existingAttendance) {
    res.status(400);
    throw new Error('Already checked in for today');
  }

  const { status } = req.body;

  if (status) {
    const validStatuses = ['Present', 'Absent', 'Half Day', 'Leave'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  const attendance = await Attendance.create({
    employee: req.user._id,
    date: new Date(),
    checkIn: new Date(),
    status: status || 'Present',
  });

  res.status(201).json({
    success: true,
    message: 'Check-in recorded successfully',
    attendance,
  });
});

// @desc    Employee check-out for today
// @route   POST /api/attendance/checkout
// @access  Private / Employee
export const checkOut = asyncHandler(async (req, res) => {
  const { start: todayStart, end: todayEnd } = getDayBounds();

  // Find today's attendance record
  const attendance = await Attendance.findOne({
    employee: req.user._id,
    date: { $gte: todayStart, $lte: todayEnd },
  });

  if (!attendance) {
    res.status(400);
    throw new Error('No check-in record found for today');
  }

  if (attendance.checkOut) {
    res.status(400);
    throw new Error('Already checked out for today');
  }

  attendance.checkOut = new Date();
  await attendance.save();

  res.status(200).json({
    success: true,
    message: 'Check-out recorded successfully',
    attendance,
  });
});

// @desc    Get logged in employee's attendance history
// @route   GET /api/attendance/my
// @access  Private / Employee
export const getMyAttendance = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;

  const filter = { employee: req.user._id };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        res.status(400);
        throw new Error('Invalid startDate format');
      }
      filter.date.$gte = start;
    }
    if (endDate) {
      const { end } = getDayBounds(endDate);
      if (isNaN(end.getTime())) {
        res.status(400);
        throw new Error('Invalid endDate format');
      }
      filter.date.$lte = end;
    }
  }

  if (status) {
    filter.status = status;
  }

  const attendanceRecords = await Attendance.find(filter).sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: attendanceRecords.length,
    attendance: attendanceRecords,
  });
});

// @desc    Get all attendance records with search & filters (Admin)
// @route   GET /api/attendance/all
// @access  Private / Admin
export const getAllAttendance = asyncHandler(async (req, res) => {
  const { employee, search, date, startDate, endDate, status } = req.query;

  const filter = {};

  // Filter by employee ID directly or via search string (name, email, employeeId)
  if (employee) {
    filter.employee = employee;
  } else if (search) {
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');

    const userIds = matchingUsers.map((u) => u._id);
    filter.employee = { $in: userIds };
  }

  // Filter by single date or date range
  if (date) {
    const { start, end } = getDayBounds(date);
    if (isNaN(start.getTime())) {
      res.status(400);
      throw new Error('Invalid date format');
    }
    filter.date = { $gte: start, $lte: end };
  } else if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        res.status(400);
        throw new Error('Invalid startDate format');
      }
      filter.date.$gte = start;
    }
    if (endDate) {
      const { end } = getDayBounds(endDate);
      if (isNaN(end.getTime())) {
        res.status(400);
        throw new Error('Invalid endDate format');
      }
      filter.date.$lte = end;
    }
  }

  // Filter by status
  if (status) {
    filter.status = status;
  }

  const attendanceRecords = await Attendance.find(filter)
    .populate('employee', 'employeeId name email department designation')
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: attendanceRecords.length,
    attendance: attendanceRecords,
  });
});
