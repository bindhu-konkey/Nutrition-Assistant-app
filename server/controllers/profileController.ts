import { Response } from 'express';
import { Profile } from '../models/Profile';
import { Goal } from '../models/Goal';
import { AuthRequest } from '../middleware/authMiddleware';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = await Profile.create({
        userId,
        name: 'My Profile',
        age: 25,
        gender: 'Other',
        height: 170,
        weight: 70,
        goal: 'Maintain Weight',
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error: any) {
    console.error('getProfile Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, age, gender, height, weight, goal } = req.body;

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (age !== undefined) updateFields.age = Number(age);
    if (gender !== undefined) updateFields.gender = gender;
    if (height !== undefined) updateFields.height = Number(height);
    if (weight !== undefined) updateFields.weight = Number(weight);
    if (goal !== undefined) {
      const validGoals = ['Weight Loss', 'Weight Gain', 'Maintain Weight'];
      if (!validGoals.includes(goal)) {
        res.status(400).json({ success: false, message: 'Invalid goal selection' });
        return;
      }
      updateFields.goal = goal;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(profile._id, updateFields);

    // Sync weight and goal type with Goal model
    let goalObj = await Goal.findOne({ userId });
    if (goalObj) {
      const updatedGoalFields: any = {};
      if (weight !== undefined) updatedGoalFields.currentWeight = Number(weight);
      if (goal !== undefined) {
        updatedGoalFields.type = goal;
        // Recalculate default daily targets based on new goal type and profile weight
        const w = Number(weight) || profile.weight;
        const h = Number(height) || profile.height;
        const a = Number(age) || profile.age;

        // Basic BMR estimate (Harris-Benedict formula)
        let bmr = 10 * w + 6.25 * h - 5 * a;
        if (gender === 'Male') bmr += 5;
        else if (gender === 'Female') bmr -= 161;
        else bmr -= 80;

        // TDEE estimate (Lightly active)
        let tdee = Math.round(bmr * 1.375);

        if (goal === 'Weight Loss') {
          updatedGoalFields.dailyCalorieTarget = Math.max(1200, tdee - 500);
          updatedGoalFields.dailyProteinTarget = Math.round(w * 2.0); // High protein
          updatedGoalFields.dailyCarbsTarget = Math.round((updatedGoalFields.dailyCalorieTarget * 0.4) / 4);
          updatedGoalFields.dailyFatTarget = Math.round((updatedGoalFields.dailyCalorieTarget * 0.25) / 9);
        } else if (goal === 'Weight Gain') {
          updatedGoalFields.dailyCalorieTarget = tdee + 400;
          updatedGoalFields.dailyProteinTarget = Math.round(w * 1.8);
          updatedGoalFields.dailyCarbsTarget = Math.round((updatedGoalFields.dailyCalorieTarget * 0.5) / 4);
          updatedGoalFields.dailyFatTarget = Math.round((updatedGoalFields.dailyCalorieTarget * 0.25) / 9);
        } else {
          updatedGoalFields.dailyCalorieTarget = tdee;
          updatedGoalFields.dailyProteinTarget = Math.round(w * 1.5);
          updatedGoalFields.dailyCarbsTarget = Math.round((updatedGoalFields.dailyCalorieTarget * 0.45) / 4);
          updatedGoalFields.dailyFatTarget = Math.round((updatedGoalFields.dailyCalorieTarget * 0.25) / 9);
        }
      }

      await Goal.findByIdAndUpdate(goalObj._id, updatedGoalFields);
    }

    res.status(200).json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error('updateProfile Error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};
