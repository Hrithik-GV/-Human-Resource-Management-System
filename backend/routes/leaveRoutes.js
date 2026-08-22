import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, isEmployee } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/apply', protect, isEmployee, applyLeave);
router.get('/my', protect, isEmployee, getMyLeaves);
router.get('/all', protect, isAdmin, getAllLeaves);
router.patch('/:id', protect, isAdmin, updateLeaveStatus);

export default router;
