import express from 'express';
import {
  getEmployeeProfile,
  updateEmployeeProfile,
} from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/profile')
  .get(protect, getEmployeeProfile)
  .put(protect, updateEmployeeProfile);

export default router;
