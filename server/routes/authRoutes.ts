import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.get('/me', protect as any, getMe as any);

export default router;
