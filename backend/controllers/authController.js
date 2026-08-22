import bcrypt from 'bcryptjs';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const formatUserResponse = (user) => ({
  _id: user._id,
  employeeId: user.employeeId,
  loginId: user.loginId || user.employeeId,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  designation: user.designation,
  phone: user.phone,
  address: user.address,
  profilePicture: user.profilePicture,
  mustChangePassword: !!user.mustChangePassword,
  companyName: user.companyName || '',
  companyLogo: user.companyLogo || '',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// @desc    Register a new user / employee
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const {
    employeeId,
    loginId,
    name,
    email,
    password,
    role,
    department,
    designation,
    phone,
    address,
    profilePicture,
    companyName,
    companyLogo,
  } = req.body;

  // Validate core required fields
  if ((!employeeId && !loginId) || !name || !email || !password) {
    res.status(400);
    throw new Error('Please provide loginId/employeeId, name, email, and password');
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  // Validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  // Set role & fallbacks for optional fields
  const userRole = role === 'admin' || role === 'Admin' ? 'Admin' : 'Employee';
  const userDepartment = department || (userRole === 'Admin' ? 'Human Resources' : 'General');
  const userDesignation = designation || (userRole === 'Admin' ? 'HR Administrator' : 'Employee');
  const userPhone = phone || '0000000000';
  const userAddress = address || 'Not provided';
  const assignedEmpId = employeeId || loginId;
  const assignedLoginId = loginId || employeeId;

  // Check if email already exists
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    res.status(400);
    throw new Error('User with this email address already exists');
  }

  // Check if employeeId or loginId already exists
  const existingId = await User.findOne({
    $or: [{ employeeId: assignedEmpId }, { loginId: assignedLoginId }],
  });
  if (existingId) {
    res.status(400);
    throw new Error('User with this Login ID or Employee ID already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User in MongoDB
  const user = await User.create({
    employeeId: assignedEmpId,
    loginId: assignedLoginId,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: userRole,
    department: userDepartment,
    designation: userDesignation,
    phone: userPhone,
    address: userAddress,
    profilePicture: profilePicture || '',
    companyName: companyName || '',
    companyLogo: companyLogo || '',
    mustChangePassword: req.body.mustChangePassword || false,
  });

  if (user) {
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: formatUserResponse(user),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate user & get token (supports Login ID or Email)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, loginId, password } = req.body;
  const identifier = (email || loginId || '').trim();

  // Validate input
  if (!identifier || !password) {
    res.status(400);
    throw new Error('Please provide Login ID/Email and password');
  }

  // Search user by email, loginId, or employeeId
  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { loginId: identifier.toUpperCase() },
      { employeeId: identifier },
      { loginId: identifier },
    ],
  });

  // Compare password using bcrypt
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserResponse(user),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Login ID/Email or password');
  }
});

// @desc    Change user password (forced first login flow)
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current password and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters long');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.mustChangePassword = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    user: formatUserResponse(user),
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  res.status(200).json({
    success: true,
    user: formatUserResponse(req.user),
  });
});
