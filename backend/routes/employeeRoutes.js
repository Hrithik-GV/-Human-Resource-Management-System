import express from 'express';
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  updateProfilePicture,
  getEmployeeDashboard,
} from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isEmployee } from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protect all employee routes with authentication and employee authorization
router.use(protect, isEmployee);

router
  .route('/profile')
  .get(getEmployeeProfile)
  .put(updateEmployeeProfile);

router.put(
  '/profile-picture',
  upload.single('profilePicture'),
  updateProfilePicture
);

router.get('/dashboard', getEmployeeDashboard);

export default router;
