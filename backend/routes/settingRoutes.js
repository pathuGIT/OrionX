import { Router } from 'express';
import { assignAdmin, changePassword, deactivate, getAdmins, getEmployees, getProfile, updateProfile } from '../controllers/settingController.js';

const router = Router();

router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);
router.put('/password/:id', changePassword);
router.get('/admins', getAdmins);
router.get('/employees', getEmployees);
router.put('/admins', assignAdmin);
router.delete('/admins/:id', deactivate);
export default router;