const express = require("express");
const Attendance = require("../models/Attendance");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const getToday = () => new Date().toISOString().split("T")[0];

// Employee Check In
router.post("/check-in", protect, async (req, res) => {
  try {
    const date = getToday();

    const existing = await Attendance.findOne({
      employee: req.user.id,
      date,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already checked in today",
      });
    }

    const attendance = await Attendance.create({
      employee: req.user.id,
      date,
      checkIn: new Date(),
      status: "Present",
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee Check Out
router.put("/check-out", protect, async (req, res) => {
  try {
    const date = getToday();

    const attendance = await Attendance.findOne({
      employee: req.user.id,
      date,
    });

    if (!attendance) {
      return res.status(400).json({
        message: "Please check in first",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Already checked out today",
      });
    }

    attendance.checkOut = new Date();

    const hoursWorked =
      (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);

    if (hoursWorked < 4) {
      attendance.status = "Half-day";
    }

    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee Attendance History
router.get("/my", protect, async (req, res) => {
  try {
    const records = await Attendance.find({
      employee: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: View All Attendance
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name employeeId department")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;