import { Response } from 'express';
import { Goal } from '../models/Goal';
import { AuthRequest } from '../middleware/authMiddleware';

export const getGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let goal = await Goal.findOne({ userId });
    if (!goal) {
      goal = await Goal.create({
        userId,
        type: 'Maintain Weight',
        currentWeight: 70,
        targetWeight: 70,
        dailyCalorieTarget: 2000,
        dailyProteinTarget: 130,
        dailyCarbsTarget: 220,
        dailyFatTarget: 65,
      });
    }

    res.status(200).json({ success: true, goal });
  } catch (error: any) {
    console.error('getGoal Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving goal' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      type,
      currentWeight,
      targetWeight,
      dailyCalorieTarget,
      dailyProteinTarget,
      dailyCarbsTarget,
      dailyFatTarget
    } = req.body;

    let goal = await Goal.findOne({ userId });
    if (!goal) {
      res.status(404).json({ success: false, message: 'Goal record not found' });
      return;
    }

    const updatedFields: any = {};
    if (type !== undefined) {
      const validTypes = ['Weight Loss', 'Weight Gain', 'Maintain Weight'];
      if (!validTypes.includes(type)) {
        res.status(400).json({ success: false, message: 'Invalid goal type' });
        return;
      }
      updatedFields.type = type;
    }

    if (currentWeight !== undefined) updatedFields.currentWeight = Number(currentWeight);
    if (targetWeight !== undefined) updatedFields.targetWeight = Number(targetWeight);
    if (dailyCalorieTarget !== undefined) updatedFields.dailyCalorieTarget = Number(dailyCalorieTarget);
    if (dailyProteinTarget !== undefined) updatedFields.dailyProteinTarget = Number(dailyProteinTarget);
    if (dailyCarbsTarget !== undefined) updatedFields.dailyCarbsTarget = Number(dailyCarbsTarget);
    if (dailyFatTarget !== undefined) updatedFields.dailyFatTarget = Number(dailyFatTarget);

    const updatedGoal = await Goal.findByIdAndUpdate(goal._id, updatedFields);

    res.status(200).json({ success: true, goal: updatedGoal });
  } catch (error: any) {
    console.error('updateGoal Error:', error);
    res.status(500).json({ success: false, message: 'Error updating goal' });
  }
};
