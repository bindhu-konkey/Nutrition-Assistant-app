import { Router } from 'express';
import { getGoal, updateGoal } from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect as any, getGoal as any);
router.put('/', protect as any, updateGoal as any);

export default router;
