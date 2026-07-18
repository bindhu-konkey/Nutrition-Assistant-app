import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Meal, WaterLog } from '../types';
import {
  Apple,
  Droplet,
  Activity,
  TrendingUp,
  Plus,
  Flame,
  Dumbbell,
  Compass,
  ArrowUpRight,
  Smile,
  ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, profile, goal, refreshMe } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [waterLog, setWaterLog] = useState<WaterLog | null>(null);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      setLoading(true);
      await refreshMe();

      // Fetch today's meals
      const mealsRes = await axios.get(`/api/meals?date=${todayStr}`);
      if (mealsRes.data.success) {
        setMeals(mealsRes.data.meals);
      }

      // Fetch today's water log
      const waterRes = await axios.get(`/api/water?date=${todayStr}`);
      if (waterRes.data.success) {
        setWaterLog(waterRes.data.waterLog);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick hydration helper
  const addQuickWater = async () => {
    try {
      const currentGlasses = waterLog ? waterLog.glasses : 0;
      const res = await axios.post('/api/water', {
        date: todayStr,
        glasses: currentGlasses + 1,
      });
      if (res.data.success) {
        setWaterLog(res.data.waterLog);
      }
    } catch (err) {
      console.error('Failed to log water', err);
    }
  };

  // Calculations
  const consumedCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const consumedCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const consumedFat = meals.reduce((sum, m) => sum + m.fat, 0);

  const calorieTarget = goal?.dailyCalorieTarget || 2000;
  const proteinTarget = goal?.dailyProteinTarget || 130;
  const carbsTarget = goal?.dailyCarbsTarget || 220;
  const fatTarget = goal?.dailyFatTarget || 65;

  const remainingCalories = Math.max(0, calorieTarget - consumedCalories);
  const caloriePercent = Math.min(100, Math.round((consumedCalories / calorieTarget) * 100));
  const proteinPercent = Math.min(100, Math.round((consumedProtein / proteinTarget) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedCarbs / carbsTarget) * 100));
  const fatPercent = Math.min(100, Math.round((consumedFat / fatTarget) * 100));

  const waterGlasses = waterLog ? waterLog.glasses : 0;
  const waterTargetGlasses = 8;
  const waterPercent = Math.min(100, Math.round((waterGlasses / waterTargetGlasses) * 100));

  // BMI calculations
  let bmi = 0;
  let bmiCategory = 'N/A';
  let bmiColor = 'text-slate-500 bg-slate-50';

  if (profile && profile.height > 0 && profile.weight > 0) {
    const heightInMeters = profile.height / 100;
    bmi = Number((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));

    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'Normal weight';
      bmiColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-orange-700 bg-orange-50 border-orange-200';
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'text-rose-700 bg-rose-50 border-rose-200';
    }
  }

  // Weight goal completion
  let goalPercent = 0;
  if (goal && goal.currentWeight !== undefined && goal.targetWeight !== undefined) {
    if (goal.type === 'Weight Loss') {
      const startingWeight = goal.currentWeight + 3; // Mocking slightly higher starting weight
      const totalToLose = startingWeight - goal.targetWeight;
      const lostSoFar = startingWeight - goal.currentWeight;
      goalPercent = totalToLose > 0 ? Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100))) : 100;
    } else if (goal.type === 'Weight Gain') {
      const startingWeight = goal.currentWeight - 3;
      const totalToGain = goal.targetWeight - startingWeight;
      const gainedSoFar = goal.currentWeight - startingWeight;
      goalPercent = totalToGain > 0 ? Math.min(100, Math.max(0, Math.round((gainedSoFar / totalToGain) * 100))) : 100;
    } else {
      goalPercent = 100; // Maintaining is an ongoing victory!
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500 font-medium">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.06),transparent_60%)]" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600">
              <Smile className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">HEALTH DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-slate-500 max-w-md">
              Your body is a temple. Today, let's focus on hitting your nutritional targets and staying beautifully hydrated.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/meals"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition"
            >
              <Plus className="h-4 w-4" />
              Log Meal
            </Link>
            <button
              onClick={addQuickWater}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition"
              id="dashboard-quick-water"
            >
              <Droplet className="h-4 w-4 text-blue-500" />
              +1 Glass Water
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Macros & Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Calorie ring & Macros Progress */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Today's Calorie Summary</h2>
            <span className="text-xs font-mono text-slate-400 uppercase">{todayStr}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            {/* SVG Calorie Circle Ring */}
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center h-44 w-44">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track */}
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="12"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-emerald-500 fill-none transition-all duration-500"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 76}
                    strokeDashoffset={2 * Math.PI * 76 * (1 - caloriePercent / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{consumedCalories}</span>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">kcal logged</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500 text-center font-medium">
                {remainingCalories > 0 ? (
                  <span><strong>{remainingCalories} Kcal</strong> remaining to hit goal</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">Calorie target completed! 🎉</span>
                )}
              </p>
            </div>

            {/* Protein, Carbs, Fats Bars */}
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nutrients Progress</span>
              
              {/* Protein */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    Protein
                  </div>
                  <span className="text-xs text-slate-500">
                    <strong className="text-slate-800">{consumedProtein}g</strong> / {proteinTarget}g ({proteinPercent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }} />
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Carbohydrates
                  </div>
                  <span className="text-xs text-slate-500">
                    <strong className="text-slate-800">{consumedCarbs}g</strong> / {carbsTarget}g ({carbsPercent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${carbsPercent}%` }} />
                </div>
              </div>

              {/* Fats */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    Fats
                  </div>
                  <span className="text-xs text-slate-500">
                    <strong className="text-slate-800">{consumedFat}g</strong> / {fatTarget}g ({fatPercent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${fatPercent}%` }} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* BMI & Goals Column */}
        <div className="space-y-8">
          
          {/* Hydration Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Hydration Daily</h3>
              <Droplet className="h-5 w-5 text-blue-500 fill-blue-50" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{waterGlasses}</span>
              <span className="text-sm text-slate-400 font-bold">/ {waterTargetGlasses} glasses</span>
            </div>
            {/* Water progress bar */}
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${waterPercent}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              {waterPercent >= 100 ? 'Awesome job! You met your hydration goals today!' : 'Keep sipping! A glass of water protects your kidneys.'}
            </p>
          </div>

          {/* BMI Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Your Body Mass Index</h3>
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>

            {profile ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-900">{bmi > 0 ? bmi : 'N/A'}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${bmiColor}`}>
                    {bmiCategory}
                  </span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  {bmiCategory === 'Normal weight' && 'Your BMI is in a healthy range. Maintain your current lifestyle!'}
                  {bmiCategory === 'Underweight' && 'Suggestions: Focus on calorie-dense, high protein meals.'}
                  {bmiCategory === 'Overweight' && 'Suggestions: Daily deficit of 300-500 calories with cardio.'}
                  {bmiCategory === 'Obese' && 'Suggestions: Low glycemic diet, portion control, and light walking.'}
                </div>
                <Link
                  to="/bmi"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                >
                  View full recommendations <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Complete your profile to view your BMI score.</p>
            )}
          </div>
        </div>
      </div>

      {/* Goal Progress Bar Section */}
      <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">Goal Target Progress</h3>
              <p className="text-xs text-slate-400">Type: <span className="font-bold text-slate-700">{goal?.type}</span></p>
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-sm text-slate-500">Current: <strong className="text-slate-800">{goal?.currentWeight}kg</strong></span>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-slate-500">Target: <strong className="text-slate-800">{goal?.targetWeight}kg</strong></span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Overall Completion</span>
            <span>{goalPercent}%</span>
          </div>
          <div className="h-3.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${goalPercent}%` }} />
          </div>
        </div>
      </section>

      {/* Today's Meals Section */}
      <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Today's Meals</h2>
          <Link
            to="/meals"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-200 transition"
          >
            Manage Meals
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-100 rounded-2xl">
            <Apple className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No meals logged for today yet.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Track your calorie intake by logging your breakfast, lunch, or dinner!</p>
            <Link
              to="/meals"
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
            >
              <Plus className="h-3 w-3" />
              Add First Meal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {meals.map(meal => (
              <div key={meal._id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100/50 transition duration-150">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center rounded-lg bg-white border border-slate-200/60 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {meal.type}
                  </span>
                  <span className="text-xs font-black text-slate-900">{meal.calories} kcal</span>
                </div>
                <h4 className="font-bold text-slate-900 truncate">{meal.name}</h4>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/40 text-center text-[10px]">
                  <div>
                    <span className="block text-slate-400 font-bold">PRO</span>
                    <span className="font-semibold text-slate-700">{meal.protein}g</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold">CARB</span>
                    <span className="font-semibold text-slate-700">{meal.carbs}g</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold">FAT</span>
                    <span className="font-semibold text-slate-700">{meal.fat}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Suggestions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white shadow-md flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">Healthy Living</span>
            <h3 className="text-lg font-bold">Curated Recipe Recommendations</h3>
            <p className="text-xs text-white/80 max-w-sm font-light">Explore calorie-controlled meal options prepared by professional dieticians.</p>
          </div>
          <Link
            to="/recipes"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md shadow-emerald-950/10 hover:scale-105 active:scale-95 transition"
          >
            <Compass className="h-5 w-5" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-6 sm:p-8 text-white shadow-md flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">Fitness Progress</span>
            <h3 className="text-lg font-bold">Adjust Your Fitness Goals</h3>
            <p className="text-xs text-white/80 max-w-sm font-light">Set custom protein, carbs, fats, and calorie targets for maximum performance.</p>
          </div>
          <Link
            to="/goals"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-md shadow-indigo-950/10 hover:scale-105 active:scale-95 transition"
          >
            <Dumbbell className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
