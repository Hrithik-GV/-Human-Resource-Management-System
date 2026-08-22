import express from 'express';
import {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply protect & Admin authorization to all routes in admin router
router.use(protect, authorizeRoles('Admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
