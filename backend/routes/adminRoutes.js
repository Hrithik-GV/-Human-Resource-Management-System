import express from 'express';
import {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  deleteUser,
  createEmployee,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Enforce authentication & Admin role authorization for all admin endpoints
router.use(protect, isAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.post('/create-employee', createEmployee);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;
