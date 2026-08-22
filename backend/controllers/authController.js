import bcrypt from 'bcryptjs';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user / employee
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const {
    employeeId,
    name,
    email,
    password,
    role,
    department,
    designation,
    phone,
    address,
    profilePicture,
  } = req.body;

  // Validate required fields
  if (
    !employeeId ||
    !name ||
    !email ||
    !password ||
    !department ||
    !designation ||
    !phone ||
    !address
  ) {
    res.status(400);
    throw new Error('Please provide all required fields');
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

  // Validate phone number format
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    res.status(400);
    throw new Error('Please provide a valid phone number (7 to 15 digits)');
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    res.status(400);
    throw new Error('User with this email address already exists');
  }

  // Check if employeeId already exists
  const existingEmployeeId = await User.findOne({ employeeId });
  if (existingEmployeeId) {
    res.status(400);
    throw new Error('User with this Employee ID already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    employeeId,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || 'Employee',
    department,
    designation,
    phone,
    address,
    profilePicture: profilePicture || '',
  });

  if (user) {
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  // Compare password using bcrypt
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
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
    user: req.user,
  });
});
