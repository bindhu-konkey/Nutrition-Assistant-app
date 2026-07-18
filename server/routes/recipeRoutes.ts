import { Router } from 'express';
import { getRecipes } from '../controllers/recipeController';

const router = Router();

router.get('/', getRecipes as any);

export default router;
