import { Response } from 'express';
import { Meal } from '../models/Meal';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMeals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { date } = req.query; // YYYY-MM-DD
    const filter: any = { userId };
    if (date) {
      filter.date = date;
    }

    const meals = await Meal.find(filter);
    // Sort meals by creation date (newest first) or type
    meals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json({ success: true, meals });
  } catch (error: any) {
    console.error('getMeals Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving meals' });
  }
};

export const addMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, type, calories, protein, carbs, fat, date } = req.body;

    if (!name || !type || calories === undefined || date === undefined) {
      res.status(400).json({ success: false, message: 'Please provide meal name, type, calories, and date' });
      return;
    }

    const validTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ success: false, message: 'Invalid meal type. Must be Breakfast, Lunch, Dinner, or Snack' });
      return;
    }

    const parsedCalories = Number(calories);
    const parsedProtein = Number(protein || 0);
    const parsedCarbs = Number(carbs || 0);
    const parsedFat = Number(fat || 0);

    if (isNaN(parsedCalories) || parsedCalories < 0 ||
        isNaN(parsedProtein) || parsedProtein < 0 ||
        isNaN(parsedCarbs) || parsedCarbs < 0 ||
        isNaN(parsedFat) || parsedFat < 0) {
      res.status(400).json({ success: false, message: 'Nutrients must be non-negative numbers' });
      return;
    }

    const meal = await Meal.create({
      userId,
      name: name.trim(),
      type,
      calories: parsedCalories,
      protein: parsedProtein,
      carbs: parsedCarbs,
      fat: parsedFat,
      date,
    });

    res.status(201).json({ success: true, meal });
  } catch (error: any) {
    console.error('addMeal Error:', error);
    res.status(500).json({ success: false, message: 'Error adding meal' });
  }
};

export const updateMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const meal = await Meal.findById(id);

    if (!meal) {
      res.status(404).json({ success: false, message: 'Meal record not found' });
      return;
    }

    if (meal.userId !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to modify this meal' });
      return;
    }

    const { name, type, calories, protein, carbs, fat, date } = req.body;

    const updatedData: any = {};
    if (name !== undefined) updatedData.name = name.trim();
    if (type !== undefined) {
      const validTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
      if (!validTypes.includes(type)) {
        res.status(400).json({ success: false, message: 'Invalid meal type' });
        return;
      }
      updatedData.type = type;
    }
    if (calories !== undefined) {
      const val = Number(calories);
      if (isNaN(val) || val < 0) {
        res.status(400).json({ success: false, message: 'Calories must be a non-negative number' });
        return;
      }
      updatedData.calories = val;
    }
    if (protein !== undefined) {
      const val = Number(protein);
      if (isNaN(val) || val < 0) {
        res.status(400).json({ success: false, message: 'Protein must be a non-negative number' });
        return;
      }
      updatedData.protein = val;
    }
    if (carbs !== undefined) {
      const val = Number(carbs);
      if (isNaN(val) || val < 0) {
        res.status(400).json({ success: false, message: 'Carbs must be a non-negative number' });
        return;
      }
      updatedData.carbs = val;
    }
    if (fat !== undefined) {
      const val = Number(fat);
      if (isNaN(val) || val < 0) {
        res.status(400).json({ success: false, message: 'Fat must be a non-negative number' });
        return;
      }
      updatedData.fat = val;
    }
    if (date !== undefined) {
      updatedData.date = date;
    }

    const updatedMeal = await Meal.findByIdAndUpdate(id, updatedData);

    res.status(200).json({ success: true, meal: updatedMeal });
  } catch (error: any) {
    console.error('updateMeal Error:', error);
    res.status(500).json({ success: false, message: 'Error updating meal' });
  }
};

export const deleteMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const meal = await Meal.findById(id);

    if (!meal) {
      res.status(404).json({ success: false, message: 'Meal record not found' });
      return;
    }

    if (meal.userId !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this meal' });
      return;
    }

    await Meal.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Meal successfully deleted' });
  } catch (error: any) {
    console.error('deleteMeal Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting meal' });
  }
};

export const getMealSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      res.status(400).json({ success: false, message: 'Date parameter is required' });
      return;
    }

    const meals = await Meal.find({ userId, date: String(date) });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(meal => {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalCarbs += meal.carbs;
      totalFat += meal.fat;
    });

    res.status(200).json({
      success: true,
      summary: {
        date,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        mealCount: meals.length,
      }
    });
  } catch (error: any) {
    console.error('getMealSummary Error:', error);
    res.status(500).json({ success: false, message: 'Error calculating summary' });
  }
};
