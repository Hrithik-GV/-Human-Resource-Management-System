import asyncHandler from '../utils/asyncHandler.js';
import Payroll from '../models/Payroll.js';
import User from '../models/User.js';

// @desc    Get logged in employee's payroll details
// @route   GET /api/payroll/my
// @access  Private / Employee
export const getMyPayroll = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findOne({ employee: req.user._id }).populate(
    'employee',
    'employeeId name email department designation'
  );

  if (!payroll) {
    res.status(404);
    throw new Error('Payroll information not found for this employee');
  }

  res.status(200).json({
    success: true,
    payroll,
  });
});

// @desc    Get all payroll records (Admin)
// @route   GET /api/payroll
// @access  Private / Admin
export const getAllPayrolls = asyncHandler(async (req, res) => {
  const { employee, search } = req.query;

  const filter = {};

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

  const payrolls = await Payroll.find(filter)
    .populate('employee', 'employeeId name email department designation')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: payrolls.length,
    payrolls,
  });
});

// @desc    Update employee payroll & calculate Net Salary (Admin)
// @route   PUT /api/payroll/:id
// @access  Private / Admin
export const updatePayroll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { basicSalary, bonus, deductions, employee } = req.body;

  // Validate non-negative inputs
  if (
    (basicSalary !== undefined && (isNaN(basicSalary) || Number(basicSalary) < 0)) ||
    (bonus !== undefined && (isNaN(bonus) || Number(bonus) < 0)) ||
    (deductions !== undefined && (isNaN(deductions) || Number(deductions) < 0))
  ) {
    res.status(400);
    throw new Error('Salary components (basicSalary, bonus, deductions) must be non-negative numbers');
  }

  // Try finding payroll by Payroll ID
  let payroll = await Payroll.findById(id);

  if (!payroll && employee) {
    payroll = await Payroll.findOne({ employee });
  }

  if (!payroll) {
    // Check if 'id' is an Employee ID to create new payroll record
    const targetUser = await User.findById(id);
    if (targetUser) {
      const basic = Number(basicSalary) || 0;
      const bon = Number(bonus) || 0;
      const ded = Number(deductions) || 0;
      const net = basic + bon - ded;

      payroll = await Payroll.create({
        employee: id,
        basicSalary: basic,
        bonus: bon,
        deductions: ded,
        netSalary: Math.max(0, net),
      });

      const populatedPayroll = await Payroll.findById(payroll._id).populate(
        'employee',
        'employeeId name email department designation'
      );

      return res.status(201).json({
        success: true,
        message: 'Payroll record created successfully',
        payroll: populatedPayroll,
      });
    }

    res.status(404);
    throw new Error('Payroll record not found');
  }

  // Update provided salary components
  if (basicSalary !== undefined) payroll.basicSalary = Number(basicSalary);
  if (bonus !== undefined) payroll.bonus = Number(bonus);
  if (deductions !== undefined) payroll.deductions = Number(deductions);

  // Recalculate Net Salary = Basic Salary + Bonus - Deductions
  const basic = payroll.basicSalary || 0;
  const bon = payroll.bonus || 0;
  const ded = payroll.deductions || 0;

  payroll.netSalary = Math.max(0, basic + bon - ded);

  await payroll.save();

  const updatedPayroll = await Payroll.findById(payroll._id).populate(
    'employee',
    'employeeId name email department designation'
  );

  res.status(200).json({
    success: true,
    message: 'Payroll updated successfully',
    payroll: updatedPayroll,
  });
});
