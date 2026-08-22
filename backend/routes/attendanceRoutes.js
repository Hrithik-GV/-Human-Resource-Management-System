import express from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, isEmployee } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/checkin', protect, isEmployee, checkIn);
router.post('/checkout', protect, isEmployee, checkOut);
router.get('/my', protect, isEmployee, getMyAttendance);
router.get('/all', protect, isAdmin, getAllAttendance);

export default router;
