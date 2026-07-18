import { Router } from 'express';
import { getWaterLog, updateWaterLog } from '../controllers/waterController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect as any, getWaterLog as any);
router.post('/', protect as any, updateWaterLog as any);

export default router;
