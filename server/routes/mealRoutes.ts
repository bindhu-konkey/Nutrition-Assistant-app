import { Router } from 'express';
import { getMeals, addMeal, updateMeal, deleteMeal, getMealSummary } from '../controllers/mealController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect as any, getMeals as any);
router.post('/', protect as any, addMeal as any);
router.get('/summary', protect as any, getMealSummary as any);
router.put('/:id', protect as any, updateMeal as any);
router.delete('/:id', protect as any, deleteMeal as any);

export default router;
