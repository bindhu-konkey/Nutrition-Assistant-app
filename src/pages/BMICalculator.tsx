import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Flame, ShieldAlert, Dumbbell, Save, CheckCircle, Apple, X } from 'lucide-react';

export const BMICalculator: React.FC = () => {
  const { profile, refreshMe } = useAuth();
  
  // Input states - default to user profile stats if loaded
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.height) setHeight(profile.height);
      if (profile.weight) setWeight(profile.weight);
    }
  }, [profile]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!height || !weight) return;

    const heightInMeters = Number(height) / 100;
    const computedBmi = Number((Number(weight) / (heightInMeters * heightInMeters)).toFixed(1));
    setBmi(computedBmi);

    if (computedBmi < 18.5) {
      setCategory('Underweight');
    } else if (computedBmi >= 18.5 && computedBmi < 25) {
      setCategory('Normal');
    } else if (computedBmi >= 25 && computedBmi < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  // Run automatically on first load if values exist
  useEffect(() => {
    if (height && weight) {
      handleCalculate();
    }
  }, [height, weight]);

  // Sync with database profile
  const handleSaveToProfile = async () => {
    if (!height || !weight) return;
    try {
      const res = await axios.put('/api/profile', {
        height: Number(height),
        weight: Number(weight),
      });
      if (res.data.success) {
        setSaveSuccess(true);
        await refreshMe();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving BMI inputs to profile:', err);
    }
  };

  // Recommendation details
  const getRecommendations = () => {
    switch (category) {
      case 'Underweight':
        return {
          calories: '2,500 - 3,000 kcal / day',
          foods: ['Nuts & Almonds', 'Dried Fruits', 'Avocados', 'Salmon & Mackerel', 'Eggs & Whole Milk', 'Oats & Brown Rice'],
          avoid: ['Excessive caffeine', 'Empty diet sodas', 'Processed potato chips', 'Skipping meals'],
          exercise: 'Strength training (hypertrophy focus) 3-4 times a week. Limit heavy cardio to preserve calories.',
          description: 'Focus on consuming nutrient-dense, calorie-rich foods and building lean muscle mass.'
        };
      case 'Normal':
        return {
          calories: '2,000 - 2,200 kcal / day',
          foods: ['Fresh leafy greens', 'Whole grains (Quinoa, Oats)', 'Chicken breast & Turkey', 'Mixed berries', 'Olive oil & Avocados'],
          avoid: ['Trans fats', 'High sodium frozen foods', 'Refined sugar baking', 'Sugary breakfast cereals'],
          exercise: 'A balanced mix of cardiovascular exercise and strength resistance training (150 minutes weekly).',
          description: 'Your BMI is in the healthy zone. Focus on maintaining your current weight, physical strength, and metabolic health.'
        };
      case 'Overweight':
        return {
          calories: '1,500 - 1,800 kcal / day',
          foods: ['Cruciferous vegetables', 'Egg whites', 'Greek yogurt', 'Lean turkey & Chicken breast', 'Lentils & Beans'],
          avoid: ['Deep-fried foods', 'White bread & Pastas', 'High-sugar sweet sodas', 'Processed lunch meats', 'Heavy creams'],
          exercise: 'HIIT (High-Intensity Interval Training) 2-3 times/week, paired with 10,000 walking steps daily.',
          description: 'A modest calorie deficit combined with consistent cardio and core strength will assist in shedding excess fat reserves safely.'
        };
      case 'Obese':
        return {
          calories: '1,200 - 1,500 kcal / day',
          foods: ['Broccoli & Spinach', 'Cucumbers & Celery', 'White-fleshed fish (Cod)', 'Skinless chicken breast', 'Chia seeds'],
          avoid: ['Refined candies & sugars', 'Salty potato chips', 'Alcoholic beverages', 'Fast food burger meals', 'High-fat cheese toppings'],
          exercise: 'Low-impact aerobic exercises like swimming, swimming-laps, elliptical trainers, or brisk walking to protect joints.',
          description: 'Focus on portion control, healthy blood sugar levels, low-glycemic meals, and steady low-impact physical mobilization.'
        };
      default:
        return null;
    }
  };

  const recs = getRecommendations();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <section className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-emerald-500" />
          BMI Calculator & Diet Suggestions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Calculate your Body Mass Index (BMI) and discover customized dietary recommendations.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Form Column */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Enter Physical Stats</h2>
          
          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Height (cm)</label>
              <input
                type="number"
                required
                min="50"
                max="250"
                placeholder="e.g. 170"
                value={height}
                onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Weight (kg)</label>
              <input
                type="number"
                required
                min="10"
                max="300"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow hover:bg-emerald-600 transition"
              id="bmi-calculate-button"
            >
              Calculate BMI
            </button>
          </form>

          {bmi !== null && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="text-center bg-slate-50 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calculated BMI Score</span>
                <p className="text-4xl font-black text-slate-900 mt-1">{bmi}</p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border mt-2 ${
                  category === 'Underweight' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  category === 'Normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  category === 'Overweight' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                  'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {category} Range
                </span>
              </div>

              <button
                onClick={handleSaveToProfile}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition"
                id="bmi-save-to-profile"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Saved to Profile
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-slate-400" />
                    Update My Profile Stats
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Suggestions Recommendations Column */}
        <div className="lg:col-span-2 space-y-8">
          {recs ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
              <div className="border-b border-slate-50 pb-5">
                <h3 className="text-lg font-extrabold text-slate-900">Customized Nutrition Recommendation</h3>
                <p className="text-sm text-slate-500 mt-1">{recs.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Calories Suggestion */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Flame className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Suggested Calories</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{recs.calories}</p>
                  <p className="text-xs text-slate-400 leading-normal">
                    This daily target is calculated to safely align your energy intake with dynamic physical needs.
                  </p>
                </div>

                {/* Exercises Suggested */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Dumbbell className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Exercise Tips</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{recs.exercise}</p>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                {/* Foods to eat */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Apple className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Healthy Foods to Focus On</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-semibold">
                    {recs.foods.map((food, i) => (
                      <li key={i} className="flex items-center gap-1.5 bg-emerald-50/40 border border-emerald-100/30 px-3 py-2 rounded-xl">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Foods to avoid */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-600">
                    <ShieldAlert className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Foods/Habits to Avoid</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-semibold">
                    {recs.avoid.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 bg-rose-50/40 border border-rose-100/30 px-3 py-2 rounded-xl">
                        <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center">
              <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700">Awaiting BMI Calculations</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Please enter your height and weight in the physical stats form on the left to unlock customized dietician recommendations and suggestions.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
