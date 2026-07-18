import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Recipe } from '../types';
import { Compass, Clock, Flame, Apple, ChevronDown, Check, Plus, Heart } from 'lucide-react';

export const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/recipes');
      if (res.data.success) {
        setRecipes(res.data.recipes);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleLogRecipe = async (recipe: Recipe) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const payload = {
        name: recipe.name,
        type: recipe.category === 'Snacks' ? 'Snack' : recipe.category,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        date: todayStr,
      };

      const res = await axios.post('/api/meals', payload);
      if (res.data.success) {
        setLogSuccess(recipe.id);
        setTimeout(() => setLogSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error auto-logging recipe:', err);
    }
  };

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const displayedRecipes = filteredCategory === 'All'
    ? recipes
    : recipes.filter(r => r.category.toLowerCase() === filteredCategory.toLowerCase());

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <section className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Compass className="h-8 w-8 text-emerald-500" />
          Healthy Recipe Suggestions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore curated, dietician-approved recipes packed with macro details and quick-logging capability.
        </p>
      </section>

      {/* Category Filtering Tabs */}
      <section className="flex flex-wrap items-center gap-2.5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setFilteredCategory(cat);
              setSelectedRecipe(null);
            }}
            className={`rounded-xl px-4.5 py-2.5 text-xs font-extrabold tracking-wider uppercase transition ${
              filteredCategory === cat
                ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10'
                : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recipes list card grid (Col-Span-2 if detail is open, full list otherwise) */}
          <div className={`${selectedRecipe ? 'lg:col-span-1.5' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 gap-6`}>
            {displayedRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className={`bg-white rounded-3xl border p-5 shadow-sm space-y-4 hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  selectedRecipe?.id === recipe.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 uppercase tracking-wide">
                      {recipe.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                      <Clock className="h-3.5 w-3.5" />
                      {recipe.prepTime}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 leading-snug">{recipe.name}</h3>

                  {/* Macros overview */}
                  <div className="flex items-baseline gap-1.5 pt-2">
                    <Flame className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-sm font-black text-slate-900">{recipe.calories} kcal</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Miniature Macros Pills */}
                  <div className="flex gap-1.5 text-[9px] font-black text-slate-500">
                    <span className="bg-slate-50 px-1.5 py-1 rounded">P: {recipe.protein}g</span>
                    <span className="bg-slate-50 px-1.5 py-1 rounded">C: {recipe.carbs}g</span>
                    <span className="bg-slate-50 px-1.5 py-1 rounded">F: {recipe.fat}g</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogRecipe(recipe);
                    }}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      logSuccess === recipe.id
                        ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                    id={`recipe-log-btn-${recipe.id}`}
                  >
                    {logSuccess === recipe.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Logged!
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        Log Meal
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recipe detail preview pane */}
          {selectedRecipe && (
            <div className="lg:col-span-1.5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-md space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto sticky top-24">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 uppercase tracking-wide">
                    {selectedRecipe.category}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">{selectedRecipe.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              {/* Recipe stats breakdown */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 rounded-2xl p-4 text-center">
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Calories</span>
                  <span className="text-sm font-black text-slate-900">{selectedRecipe.calories}k</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Protein</span>
                  <span className="text-sm font-black text-slate-900">{selectedRecipe.protein}g</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Carbs</span>
                  <span className="text-sm font-black text-slate-900">{selectedRecipe.carbs}g</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Fat</span>
                  <span className="text-sm font-black text-slate-900">{selectedRecipe.fat}g</span>
                </div>
              </div>

              {/* Ingredients list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ingredients ({selectedRecipe.ingredients.length})</h4>
                <ul className="space-y-2 text-xs text-slate-600 leading-normal">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cooking Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Directions</h4>
                <ol className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[10px] font-black text-emerald-700">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Dietician Tip */}
              {selectedRecipe.tip && (
                <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase">
                    <Heart className="h-4 w-4 fill-emerald-100" />
                    Dietician Tip
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{selectedRecipe.tip}"
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
