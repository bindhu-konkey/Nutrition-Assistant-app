import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Shield, HelpCircle, CheckCircle, Scale, Activity } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, user, refreshMe } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Other');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [goal, setGoal] = useState<'Weight Loss' | 'Weight Gain' | 'Maintain Weight'>('Maintain Weight');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age || '');
      setGender(profile.gender || 'Other');
      setHeight(profile.height || '');
      setWeight(profile.weight || '');
      setGoal(profile.goal || 'Maintain Weight');
    }
    setLoading(false);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !age || !height || !weight) {
      setMessage({ text: 'Please fill in all profile fields', type: 'error' });
      return;
    }

    const payload = {
      name: name.trim(),
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      goal,
    };

    try {
      setLoading(true);
      const res = await axios.put('/api/profile', payload);
      if (res.data.success) {
        setMessage({ text: 'Profile successfully updated! Biometric goals synchronized.', type: 'success' });
        await refreshMe();
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setMessage({ text: err.response?.data?.message || 'Failed to save profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
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
          <User className="h-8 w-8 text-emerald-500" />
          My Profile & Biometrics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Keep your biological stats accurate to guarantee optimal nutrient targets.
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
        
        {/* Profile Card Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-2xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="mt-4 font-black text-slate-900 text-lg leading-tight">{user?.name}</h3>
            <span className="text-xs text-slate-400 font-bold mt-1 uppercase">{user?.email}</span>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Selected Strategy</span>
              <span className="font-bold text-slate-800 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5">{goal}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Height</span>
              <span className="font-bold text-slate-800">{height} cm</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Weight</span>
              <span className="font-bold text-slate-800">{weight} kg</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Age</span>
              <span className="font-bold text-slate-800">{age} years</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50 space-y-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Shield className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Medical Disclaimer</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              NutriGuide suggests values based on Harris-Benedict algorithms. Consult with a qualified physician before initiating any sudden intensive diet.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-4 mb-6">Modify Personal Biometrics</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Preferred Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Age (years)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Biological Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Height (cm)</label>
                <input
                  type="number"
                  required
                  min="50"
                  max="250"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Weight (kg)</label>
                <input
                  type="number"
                  required
                  min="10"
                  max="300"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Goal Strategy</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as any)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 py-3 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Weight Gain">Weight Gain</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white shadow hover:bg-emerald-600 transition disabled:opacity-50"
                id="profile-save-button"
              >
                Save Biometrics
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
