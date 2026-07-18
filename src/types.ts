export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Profile {
  _id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: 'Weight Loss' | 'Weight Gain' | 'Maintain Weight';
}

export interface Goal {
  _id: string;
  userId: string;
  type: 'Weight Loss' | 'Weight Gain' | 'Maintain Weight';
  targetWeight: number;
  currentWeight: number;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
}

export interface Meal {
  _id: string;
  userId: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // YYYY-MM-DD
}

export interface WaterLog {
  _id: string;
  userId: string;
  date: string;
  glasses: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  tip?: string;
}
