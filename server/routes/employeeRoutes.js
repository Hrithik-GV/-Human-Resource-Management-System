const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all employees - Admin only
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const employees = await User.find(
      { role: "employee" },
      "-password"
    ).sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Create employee - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      department,
      jobTitle,
    } = req.body;

    // Check required fields
    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        message: "Employee ID, name, email and password are required",
      });
    }

    // Check if employee already exists
    const existingEmployee = await User.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee with this email or Employee ID already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = await User.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      department,
      jobTitle,
      role: "employee",
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        _id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        jobTitle: employee.jobTitle,
        role: employee.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;