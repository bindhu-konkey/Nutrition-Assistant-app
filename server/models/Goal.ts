import { db } from '../config/db';

export interface IGoal {
  _id: string;
  userId: string;
  type: 'Weight Loss' | 'Weight Gain' | 'Maintain Weight';
  targetWeight: number;
  currentWeight: number;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
  createdAt: string;
}

export const Goal = {
  find: (filter?: Partial<IGoal>) => db.goals.find(filter),
  findOne: (filter?: Partial<IGoal>) => db.goals.findOne(filter),
  findById: (id: string) => db.goals.findById(id),
  create: (data: Omit<IGoal, '_id' | 'createdAt'>) => db.goals.create(data),
  findByIdAndUpdate: (id: string, updateData: Partial<IGoal>) => db.goals.findByIdAndUpdate(id, updateData),
  findByIdAndDelete: (id: string) => db.goals.findByIdAndDelete(id),
};
