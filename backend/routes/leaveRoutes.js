import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/all', protect, authorizeRoles('Admin'), getAllLeaves);
router.patch('/:id', protect, authorizeRoles('Admin'), updateLeaveStatus);

export default router;
