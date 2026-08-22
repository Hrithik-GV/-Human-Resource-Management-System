import express from 'express';
import {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply protect & isAdmin authorization to all routes in admin router
router.use(protect, isAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
