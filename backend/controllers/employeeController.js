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

  // Validate phone number if provided
  if (phone !== undefined) {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400);
      throw new Error('Please provide a valid phone number (7 to 15 digits)');
    }
    user.phone = phone;
  }

  // Update allowed fields only (prevent modifications to role, password, employeeId, email)
  if (name !== undefined) user.name = name;
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

// @desc    Upload / Update employee profile picture
// @route   PUT /api/employee/profile-picture
// @access  Private / Employee
export const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const filePath = req.file.path.replace(/\\/g, '/');
  user.profilePicture = filePath;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile picture updated successfully',
    profilePicture: user.profilePicture,
    user: {
      _id: user._id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      profilePicture: user.profilePicture,
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
