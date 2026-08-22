const express = require("express");
const Leave = require("../models/Leave");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Employee: Create leave request
router.post("/", protect, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const leave = await Leave.create({
      employee: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee: View own leave requests
router.get("/my", protect, async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: View all leave requests
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name employeeId department")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Approve or reject leave
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    leave.status = status;
    await leave.save();

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;