import asyncHandler from '../utils/asyncHandler.js';
import Leave from '../models/Leave.js';
import User from '../models/User.js';

// @desc    Apply for leave (Employee)
// @route   POST /api/leave/apply
// @access  Private / Employee
export const applyLeave = asyncHandler(async (req, res) => {
  const { leaveType, fromDate, toDate, startDate, endDate, reason } = req.body;

  const start = fromDate || startDate;
  const end = toDate || endDate;

  if (!leaveType || !start || !end) {
    res.status(400);
    throw new Error('Please provide leaveType, fromDate (or startDate), and toDate (or endDate)');
  }

  const from = new Date(start);
  const to = new Date(end);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    res.status(400);
    throw new Error('Invalid date format provided');
  }

  if (from > to) {
    res.status(400);
    throw new Error('fromDate cannot be after toDate');
  }

  const leave = await Leave.create({
    employee: req.user._id,
    leaveType,
    fromDate: from,
    toDate: to,
    reason: reason || '',
    status: 'Pending',
  });

  res.status(201).json({
    success: true,
    message: 'Leave application submitted successfully',
    leave,
  });
});

// @desc    Get logged in employee's leave applications
// @route   GET /api/leave/my
// @access  Private / Employee
export const getMyLeaves = asyncHandler(async (req, res) => {
  const { status, leaveType } = req.query;

  const filter = { employee: req.user._id };

  if (status) {
    filter.status = status;
  }
  if (leaveType) {
    filter.leaveType = leaveType;
  }

  const leaves = await Leave.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: leaves.length,
    leaves,
  });
});

// @desc    Get all leave applications (Admin)
// @route   GET /api/leave/all
// @access  Private / Admin
export const getAllLeaves = asyncHandler(async (req, res) => {
  const { status, leaveType, employee, search } = req.query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (leaveType) {
    filter.leaveType = leaveType;
  }

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

  const leaves = await Leave.find(filter)
    .populate('employee', 'employeeId name email department designation')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: leaves.length,
    leaves,
  });
});

// @desc    Approve / Reject leave request & add comments (Admin)
// @route   PATCH /api/leave/:id
// @access  Private / Admin
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminComment, comment, comments } = req.body;

  const leave = await Leave.findById(id);

  if (!leave) {
    res.status(404);
    throw new Error('Leave application not found');
  }

  if (status) {
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    leave.status = status;
  }

  const note = adminComment || comment || comments;
  if (note !== undefined) {
    leave.adminComment = note;
  }

  await leave.save();

  const updatedLeave = await Leave.findById(id).populate(
    'employee',
    'employeeId name email department designation'
  );

  res.status(200).json({
    success: true,
    message: `Leave request updated to '${leave.status}'`,
    leave: updatedLeave,
  });
});
