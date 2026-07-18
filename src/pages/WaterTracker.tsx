import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Droplet, Plus, Minus, Info, Award, Heart, Sparkles } from 'lucide-react';

export const WaterTracker: React.FC = () => {
  const [glasses, setGlasses] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8); // default to 8 glasses (2000ml)
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [message, setMessage] = useState<string | null>(null);

  const fetchWaterLog = async (selectedDate: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/water?date=${selectedDate}`);
      if (res.data.success) {
        setGlasses(res.data.waterLog.glasses);
      }
    } catch (err) {
      console.error('Error fetching water log:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterLog(date);
  }, [date]);

  const updateGlasses = async (newValue: number) => {
    const clampedValue = Math.max(0, newValue);
    setGlasses(clampedValue);
    try {
      const res = await axios.post('/api/water', {
        date,
        glasses: clampedValue,
      });
      if (res.data.success) {
        setGlasses(res.data.waterLog.glasses);
        if (clampedValue >= dailyGoal) {
          setMessage('Amazing! You completed your hydration goal! 💧🏆');
        } else {
          setMessage(null);
        }
      }
    } catch (err) {
      console.error('Error logging water:', err);
    }
  };

  const percentComplete = Math.min(100, Math.round((glasses / dailyGoal) * 100));

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <section className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Droplet className="h-8 w-8 text-blue-500 fill-blue-50" />
            Hydration Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Logging water helps control appetite, boosts physical energy, and enhances focus.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>
      </section>

      {message && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm font-semibold text-blue-800 animate-bounce">
          <Award className="h-5 w-5 text-blue-600 fill-blue-100" />
          <p>{message}</p>
        </div>
      )}

      {/* Grid: Hydration Controls & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main interactive water card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Your Daily Hydration</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">DAILY GOAL:</span>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                {[4, 6, 8, 10, 12, 14, 16].map(g => (
                  <option key={g} value={g}>{g} glasses ({g * 250} ml)</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Animation/Liquid level representation */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-40 h-56 border-4 border-slate-200 rounded-b-3xl rounded-t-lg overflow-hidden bg-slate-50 flex flex-col justify-end">
                  {/* Wave effect representation using tailwind */}
                  <div
                    className="bg-blue-500/80 w-full transition-all duration-500 ease-out flex items-center justify-center"
                    style={{ height: `${percentComplete}%` }}
                  >
                    {percentComplete > 10 && (
                      <span className="text-white font-black text-lg drop-shadow">{percentComplete}%</span>
                    )}
                  </div>
                  {percentComplete <= 10 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-400 font-bold text-sm">Empty glass</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">1 Glass = 250 ml</p>
              </div>

              {/* Water logging actions */}
              <div className="space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Glasses Logged</span>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <span className="text-5xl font-black text-slate-900">{glasses}</span>
                    <span className="text-lg text-slate-400 font-bold">/ {dailyGoal} glasses</span>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">Total volume: {glasses * 250} ml</p>
                </div>

                {/* Hydration progress bar */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percentComplete}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                    <span>PROGRESS</span>
                    <span>{percentComplete}%</span>
                  </div>
                </div>

                {/* Counter controls */}
                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                  <button
                    onClick={() => updateGlasses(glasses - 1)}
                    disabled={glasses === 0}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600 shadow hover:bg-slate-50 disabled:opacity-30 active:scale-95 transition"
                    title="Remove 1 glass"
                  >
                    <Minus className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => updateGlasses(glasses + 1)}
                    className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 font-bold text-white shadow-lg shadow-blue-500/15 hover:bg-blue-600 active:scale-98 transition"
                    title="Add 1 glass"
                    id="water-add-one-glass"
                  >
                    <Plus className="h-5 w-5" />
                    Add Glass
                  </button>
                </div>

                {/* Quick macro increments */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateGlasses(glasses + 2)}
                    className="flex-1 py-2 text-xs font-bold rounded-lg border border-blue-100 bg-blue-50/40 text-blue-700 hover:bg-blue-50 transition"
                  >
                    +2 Glasses
                  </button>
                  <button
                    onClick={() => updateGlasses(glasses + 4)}
                    className="flex-1 py-2 text-xs font-bold rounded-lg border border-blue-100 bg-blue-50/40 text-blue-700 hover:bg-blue-50 transition"
                  >
                    +4 Glasses
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits and info card */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Did You Know?
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex gap-2">
                <Heart className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Drinking water on an empty stomach fires up your metabolism by up to 24%.</span>
              </li>
              <li className="flex gap-2">
                <Heart className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Mild dehydration can impair cognitive function, mood, and memory.</span>
              </li>
              <li className="flex gap-2">
                <Heart className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Adequate hydration helps prevent kidney stones and keeps joints properly lubricated.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Info className="h-5 w-5" />
            </div>
            <h4 className="font-bold">Hydration Pro-Tip</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Drink a glass of water first thing in the morning and another 30 minutes before meals to aid digestion and promote appetite control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
