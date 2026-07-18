import { db } from '../config/db';

export interface IMeal {
  _id: string;
  userId: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export const Meal = {
  find: (filter?: Partial<IMeal>) => db.meals.find(filter),
  findOne: (filter?: Partial<IMeal>) => db.meals.findOne(filter),
  findById: (id: string) => db.meals.findById(id),
  create: (data: Omit<IMeal, '_id' | 'createdAt'>) => db.meals.create(data),
  findByIdAndUpdate: (id: string, updateData: Partial<IMeal>) => db.meals.findByIdAndUpdate(id, updateData),
  findByIdAndDelete: (id: string) => db.meals.findByIdAndDelete(id),
};
