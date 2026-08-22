import express from 'express';
import {
  getMyPayroll,
  getAllPayrolls,
  updatePayroll,
} from '../controllers/payrollController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, isEmployee } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/my', protect, isEmployee, getMyPayroll);
router.get('/', protect, isAdmin, getAllPayrolls);
router.put('/:id', protect, isAdmin, updatePayroll);

export default router;
