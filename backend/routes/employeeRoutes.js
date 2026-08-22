import express from 'express';
import {
  getEmployeeProfile,
  updateEmployeeProfile,
} from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isEmployee } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
  .route('/profile')
  .get(protect, isEmployee, getEmployeeProfile)
  .put(protect, isEmployee, updateEmployeeProfile);

export default router;
