import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Meal } from '../types';
import { Plus, Trash2, Edit2, Calendar, Sparkles, X, Apple } from 'lucide-react';

export const MealTracker: React.FC = () => {
  const { goal } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Date filtering state - default to today
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [formCalories, setFormCalories] = useState<number | ''>('');
  const [formProtein, setFormProtein] = useState<number | ''>('');
  const [formCarbs, setFormCarbs] = useState<number | ''>('');
  const [formFat, setFormFat] = useState<number | ''>('');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchMeals = async (date: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/meals?date=${date}`);
      if (res.data.success) {
        setMeals(res.data.meals);
      }
    } catch (err) {
      console.error('Error fetching meals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(selectedDate);
  }, [selectedDate]);

  // Open form for adding
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormType('Breakfast');
    setFormCalories('');
    setFormProtein('');
    setFormCarbs('');
    setFormFat('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleOpenEdit = (meal: Meal) => {
    setEditingId(meal._id);
    setFormName(meal.name);
    setFormType(meal.type);
    setFormCalories(meal.calories);
    setFormProtein(meal.protein);
    setFormCarbs(meal.carbs);
    setFormFat(meal.fat);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  // Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!formName.trim() || formCalories === '') {
      setFormError('Please fill in meal name and calories');
      return;
    }

    const payload = {
      name: formName.trim(),
      type: formType,
      calories: Number(formCalories),
      protein: Number(formProtein || 0),
      carbs: Number(formCarbs || 0),
      fat: Number(formFat || 0),
      date: selectedDate,
    };

    try {
      if (editingId) {
        // Edit Mode
        const res = await axios.put(`/api/meals/${editingId}`, payload);
        if (res.data.success) {
          fetchMeals(selectedDate);
          handleCloseForm();
        }
      } else {
        // Add Mode
        const res = await axios.post('/api/meals', payload);
        if (res.data.success) {
          fetchMeals(selectedDate);
          handleCloseForm();
        }
      }
    } catch (err: any) {
      console.error('Error saving meal:', err);
      setFormError(err.response?.data?.message || 'Error occurred while saving the meal.');
    }
  };

  // Delete Handler
  const handleDeleteMeal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal record?')) {
      try {
        const res = await axios.delete(`/api/meals/${id}`);
        if (res.data.success) {
          fetchMeals(selectedDate);
        }
      } catch (err) {
        console.error('Error deleting meal:', err);
      }
    }
  };

  // Sum calculations
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

  // Suggested values from Goal context
  const targetCalories = goal?.dailyCalorieTarget || 2000;
  const remainingCalories = Math.max(0, targetCalories - totalCalories);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header section */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Apple className="h-8 w-8 text-emerald-500" />
            Daily Meal Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track what you eat and see how well you match your macronutrient targets.
          </p>
        </div>

        {/* Date Filter & Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition"
            id="meal-add-button"
          >
            <Plus className="h-4.5 w-4.5" />
            Add Meal
          </button>
        </div>
      </section>

      {/* Date Macro Summary Banner */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-emerald-50/40 rounded-3xl border border-emerald-100/50 p-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider">TOTAL CALORIES</span>
          <p className="text-2xl font-black text-emerald-900">{totalCalories} <span className="text-xs font-semibold text-emerald-700">kcal</span></p>
        </div>
        <div className="space-y-1 border-l border-emerald-100/60 pl-4 md:pl-6">
          <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider">PROTEIN</span>
          <p className="text-2xl font-black text-emerald-900">{totalProtein} <span className="text-xs font-semibold text-emerald-700">g</span></p>
        </div>
        <div className="space-y-1 border-l border-emerald-100/60 pl-4 md:pl-6">
          <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider">CARBOHYDRATES</span>
          <p className="text-2xl font-black text-emerald-900">{totalCarbs} <span className="text-xs font-semibold text-emerald-700">g</span></p>
        </div>
        <div className="space-y-1 border-l border-emerald-100/60 pl-4 md:pl-6">
          <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider">FAT</span>
          <p className="text-2xl font-black text-emerald-900">{totalFat} <span className="text-xs font-semibold text-emerald-700">g</span></p>
        </div>
        <div className="col-span-2 md:col-span-1 space-y-1 border-l-0 md:border-l border-emerald-100/60 pl-0 md:pl-6 pt-4 md:pt-0">
          <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider">REMAINING TARGET</span>
          <p className="text-2xl font-black text-emerald-900">{remainingCalories} <span className="text-xs font-semibold text-emerald-700">kcal</span></p>
        </div>
      </section>

      {/* Main Meal Listing */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-xs text-slate-500">Loading meals list...</p>
          </div>
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <Apple className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700">No Meals Logged for this Date</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Logging what you consume is vital to weight management. Use the add meal button above to start tracking.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition"
          >
            <Plus className="h-4 w-4" />
            Log Your First Meal
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="min-w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Meal Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Calories</th>
                  <th className="px-6 py-4">Protein</th>
                  <th className="px-6 py-4">Carbs</th>
                  <th className="px-6 py-4">Fat</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {meals.map((meal) => (
                  <tr key={meal._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{meal.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold border ${
                        meal.type === 'Breakfast' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        meal.type === 'Lunch' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        meal.type === 'Dinner' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-purple-50 text-purple-700 border-purple-100'
                      }`}>
                        {meal.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{meal.calories} kcal</td>
                    <td className="px-6 py-4">{meal.protein}g</td>
                    <td className="px-6 py-4">{meal.carbs}g</td>
                    <td className="px-6 py-4">{meal.fat}g</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(meal)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          title="Edit Meal"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(meal._id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Meal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Meal Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                {editingId ? 'Edit Meal Entry' : 'Log New Meal'}
              </h3>
              <button
                onClick={handleCloseForm}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="text-sm bg-rose-50 text-rose-800 p-3 rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Meal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scrambled Eggs with Spinach"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Meal Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 350"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Fat (g)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formFat}
                    onChange={(e) => setFormFat(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 justify-center rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                >
                  {editingId ? 'Update Meal' : 'Add Meal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
