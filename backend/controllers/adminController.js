import bcrypt from 'bcryptjs';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';

/**
 * Helper to generate structured Login ID
 * First 2 letters of first name + First 2 letters of last name + Year + 4-digit sequence
 * Example: Oliver Todd -> OITODO20230001
 */
const generateStructuredLoginId = async (name = '', year = new Date().getFullYear()) => {
  const cleanName = name.trim();
  const nameParts = cleanName.split(/\s+/);
  const firstName = nameParts[0] || 'EM';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

  const firstTwoFirst = firstName.substring(0, 2).padEnd(2, 'X').toUpperCase();
  const firstTwoLast = lastName.substring(0, 2).padEnd(2, 'X').toUpperCase();

  const count = await User.countDocuments();
  const seqPadded = String(count + 1).padStart(4, '0');

  return `${firstTwoFirst}${firstTwoLast}${year}${seqPadded}`;
};

/**
 * Helper to generate secure temporary password
 */
const generateTempPassword = () => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `Dayflow#${randomDigits}`;
};

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
      { loginId: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Create a new Employee (Admin Only)
// @route   POST /api/admin/create-employee
// @access  Private / Admin
export const createEmployee = asyncHandler(async (req, res) => {
  const {
    companyName,
    companyLogo,
    name,
    email,
    phone,
    department,
    designation,
    joiningYear,
  } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Please provide Company Name, Employee Name, Email, and Phone Number');
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    res.status(400);
    throw new Error('An employee with this email address already exists');
  }

  // Auto-generate Login ID and Temporary Password
  const loginId = await generateStructuredLoginId(name, joiningYear || new Date().getFullYear());
  const tempPassword = generateTempPassword();

  // Hash temporary password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(tempPassword, salt);

  // Create User
  const user = await User.create({
    employeeId: loginId,
    loginId,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'Employee',
    department: department || 'General',
    designation: designation || 'Employee',
    phone,
    address: 'Not provided',
    profilePicture: '',
    companyName: companyName || '',
    companyLogo: companyLogo || '',
    mustChangePassword: true,
  });

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    loginId,
    temporaryPassword: tempPassword,
    user: {
      _id: user._id,
      employeeId: user.employeeId,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      phone: user.phone,
      companyName: user.companyName,
      companyLogo: user.companyLogo,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
    },
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
