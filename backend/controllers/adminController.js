import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';

// @desc    Get admin dashboard metrics & statistics
// @route   GET /api/admin/dashboard
// @access  Private / Admin
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalEmployees = await User.countDocuments({ role: 'Employee' });

  // Compute today's date range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const presentToday = await Attendance.countDocuments({
    date: { $gte: todayStart, $lte: todayEnd },
    status: 'Present',
  });

  const pendingLeaveRequests = await Leave.countDocuments({ status: 'Pending' });

  const totalPayrollRecords = await Payroll.countDocuments();

  res.status(200).json({
    success: true,
    stats: {
      totalEmployees,
      presentToday,
      pendingLeaveRequests,
      totalPayrollRecords,
    },
  });
});

// @desc    Get all employees / users (Admin)
// @route   GET /api/admin/users
// @access  Private / Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, department } = req.query;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (department) {
    filter.department = department;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get single user details by ID (Admin)
// @route   GET /api/admin/users/:id
// @access  Private / Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Delete employee user by ID (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private / Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  // Clean up user's attendance, leave, and payroll records
  await Attendance.deleteMany({ employee: user._id });
  await Leave.deleteMany({ employee: user._id });
  await Payroll.deleteMany({ employee: user._id });

  res.status(200).json({
    success: true,
    message: 'User and associated records deleted successfully',
  });
});
