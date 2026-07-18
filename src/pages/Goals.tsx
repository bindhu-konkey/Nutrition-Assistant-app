import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Award, Target, Flame, ChevronRight, CheckCircle, HelpCircle } from 'lucide-react';

export const Goals: React.FC = () => {
  const { goal, profile, refreshMe } = useAuth();

  const [type, setType] = useState<'Weight Loss' | 'Weight Gain' | 'Maintain Weight'>('Maintain Weight');
  const [currentWeight, setCurrentWeight] = useState<number | ''>('');
  const [targetWeight, setTargetWeight] = useState<number | ''>('');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<number | ''>('');
  const [dailyProteinTarget, setDailyProteinTarget] = useState<number | ''>('');
  const [dailyCarbsTarget, setDailyCarbsTarget] = useState<number | ''>('');
  const [dailyFatTarget, setDailyFatTarget] = useState<number | ''>('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (goal) {
      setType(goal.type);
      setCurrentWeight(goal.currentWeight);
      setTargetWeight(goal.targetWeight);
      setDailyCalorieTarget(goal.dailyCalorieTarget);
      setDailyProteinTarget(goal.dailyProteinTarget);
      setDailyCarbsTarget(goal.dailyCarbsTarget);
      setDailyFatTarget(goal.dailyFatTarget);
    }
    setLoading(false);
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Basic Validations
    if (!currentWeight || !targetWeight || !dailyCalorieTarget || !dailyProteinTarget || !dailyCarbsTarget || !dailyFatTarget) {
      setMessage({ text: 'Please fill in all target fields', type: 'error' });
      return;
    }

    const payload = {
      type,
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      dailyCalorieTarget: Number(dailyCalorieTarget),
      dailyProteinTarget: Number(dailyProteinTarget),
      dailyCarbsTarget: Number(dailyCarbsTarget),
      dailyFatTarget: Number(dailyFatTarget),
    };

    try {
      setLoading(true);
      const res = await axios.put('/api/goals', payload);
      if (res.data.success) {
        setMessage({ text: 'Your fitness goals have been updated successfully!', type: 'success' });
        await refreshMe();
      }
    } catch (err: any) {
      console.error('Error updating goal targets:', err);
      setMessage({ text: err.response?.data?.message || 'Failed to update goals.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Smart formula auto-calculating targets
  const handleAutoCalculate = () => {
    if (!profile) {
      setMessage({ text: 'Please fill in height & age on Profile page to calculate!', type: 'error' });
      return;
    }

    const w = profile.weight || 70;
    const h = profile.height || 170;
    const a = profile.age || 25;
    const g = profile.gender || 'Other';

    // BMR approximation
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (g === 'Male') bmr += 5;
    else if (g === 'Female') bmr -= 161;
    else bmr -= 80;

    // TDEE estimation (Light Activity)
    const tdee = Math.round(bmr * 1.375);

    let calTarget = tdee;
    let proteinVal = Math.round(w * 1.6);
    let carbsVal = 220;
    let fatVal = 65;

    if (type === 'Weight Loss') {
      calTarget = Math.max(1200, tdee - 500);
      proteinVal = Math.round(w * 2.0); // High protein during deficit
      carbsVal = Math.round((calTarget * 0.4) / 4);
      fatVal = Math.round((calTarget * 0.25) / 9);
    } else if (type === 'Weight Gain') {
      calTarget = tdee + 400;
      proteinVal = Math.round(w * 1.8);
      carbsVal = Math.round((calTarget * 0.5) / 4);
      fatVal = Math.round((calTarget * 0.25) / 9);
    } else {
      calTarget = tdee;
      proteinVal = Math.round(w * 1.5);
      carbsVal = Math.round((calTarget * 0.45) / 4);
      fatVal = Math.round((calTarget * 0.25) / 9);
    }

    setDailyCalorieTarget(calTarget);
    setDailyProteinTarget(proteinVal);
    setDailyCarbsTarget(carbsVal);
    setDailyFatTarget(fatVal);

    setMessage({ text: 'Healthy targets computed based on your height, weight & gender! Review below.', type: 'success' });
  };

  // Goal weight completion percentage
  let weightPercent = 0;
  if (currentWeight && targetWeight) {
    if (type === 'Weight Loss') {
      const startW = Number(currentWeight) + 4; // Mock slightly higher starting weight
      const loseTot = startW - Number(targetWeight);
      const lostCur = startW - Number(currentWeight);
      weightPercent = loseTot > 0 ? Math.min(100, Math.max(0, Math.round((lostCur / loseTot) * 100))) : 100;
    } else if (type === 'Weight Gain') {
      const startW = Number(currentWeight) - 4;
      const gainTot = Number(targetWeight) - startW;
      const gainCur = Number(currentWeight) - startW;
      weightPercent = gainTot > 0 ? Math.min(100, Math.max(0, Math.round((gainCur / gainTot) * 100))) : 100;
    } else {
      weightPercent = 100; // Maintenance is always complete
    }
  }

  if (loading && !goal) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <section className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Target className="h-8 w-8 text-emerald-500" />
          Goal & Target Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Adjust weight programs, modify macronutrient targets, or let the dietician engine calculate suggestions.
        </p>
      </section>

      {message && (
        <div className={`flex items-start gap-2.5 rounded-2xl p-4 text-sm font-semibold border ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" /> : <HelpCircle className="h-5 w-5 text-rose-600 shrink-0" />}
          <p>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Progress Display Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Your Program Status
          </h2>

          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Strategy</span>
              <p className="text-xl font-black text-slate-900 mt-1">{type}</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Weight Target Progress</span>
                <span>{weightPercent}%</span>
              </div>
              <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${weightPercent}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-semibold pt-1">
                <span>Current: {currentWeight}kg</span>
                <span>Target: {targetWeight}kg</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/20 space-y-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Award className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Daily Calorie Target</h4>
            <p className="text-3xl font-black text-slate-900">{dailyCalorieTarget} <span className="text-xs text-slate-400 font-bold">KCAL / DAY</span></p>
          </div>
        </div>

        {/* Inputs Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-base font-extrabold text-slate-900">Configure Nutrition Targets</h2>
            <button
              type="button"
              onClick={handleAutoCalculate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
              id="goals-auto-calc-button"
            >
              <Flame className="h-3.5 w-3.5" />
              Auto-Calculate Defaults
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Goal selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Dietary Program Strategy</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {['Weight Loss', 'Weight Gain', 'Maintain Weight'].map(strategy => (
                  <button
                    key={strategy}
                    type="button"
                    onClick={() => setType(strategy as any)}
                    className={`rounded-xl py-3 text-xs font-bold border transition ${
                      type === strategy
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {strategy}
                  </button>
                ))}
              </div>
            </div>

            {/* Weights inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Current Weight (kg)</label>
                <input
                  type="number"
                  required
                  min="30"
                  max="250"
                  placeholder="70"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Target Weight (kg)</label>
                <input
                  type="number"
                  required
                  min="30"
                  max="250"
                  placeholder="65"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Macros inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Calorie Budget (kcal)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  max="8000"
                  placeholder="2000"
                  value={dailyCalorieTarget}
                  onChange={(e) => setDailyCalorieTarget(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Protein target (g)</label>
                <input
                  type="number"
                  required
                  min="20"
                  max="300"
                  placeholder="130"
                  value={dailyProteinTarget}
                  onChange={(e) => setDailyProteinTarget(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Carbohydrates target (g)</label>
                <input
                  type="number"
                  required
                  min="20"
                  max="800"
                  placeholder="220"
                  value={dailyCarbsTarget}
                  onChange={(e) => setDailyCarbsTarget(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Fat target (g)</label>
                <input
                  type="number"
                  required
                  min="10"
                  max="200"
                  placeholder="65"
                  value={dailyFatTarget}
                  onChange={(e) => setDailyFatTarget(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 transition active:scale-[0.99] disabled:opacity-50"
                id="goals-save-button"
              >
                Save Goals & Targets
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
