import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';

// @desc    Get logged in employee profile
// @route   GET /api/employee/profile
// @access  Private / Employee
export const getEmployeeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update logged in employee profile
// @route   PUT /api/employee/profile
// @access  Private / Employee
export const updateEmployeeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const { phone, address, department, designation, profilePicture, name } = req.body;

  // Update allowed fields only (prevent modifications to role, password, employeeId, email)
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (department !== undefined) user.department = department;
  if (designation !== undefined) user.designation = designation;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      _id: updatedUser._id,
      employeeId: updatedUser.employeeId,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      designation: updatedUser.designation,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePicture: updatedUser.profilePicture,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  });
});

// @desc    Get employee dashboard summary
// @route   GET /api/employee/dashboard
// @access  Private / Employee
export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const employeeId = req.user._id;

  const user = await User.findById(employeeId).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  // Fetch summary counts for dashboard
  const totalAttendanceCount = await Attendance.countDocuments({ employee: employeeId });
  const pendingLeaveCount = await Leave.countDocuments({
    employee: employeeId,
    status: 'Pending',
  });
  const payrollRecord = await Payroll.findOne({ employee: employeeId });

  res.status(200).json({
    success: true,
    data: {
      employee: user,
      summary: {
        totalAttendanceCount,
        pendingLeaveCount,
        payrollAvailable: Boolean(payrollRecord),
        latestPayroll: payrollRecord || null,
      },
    },
  });
});
