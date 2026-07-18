import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect as any, getProfile as any);
router.put('/', protect as any, updateProfile as any);

export default router;
