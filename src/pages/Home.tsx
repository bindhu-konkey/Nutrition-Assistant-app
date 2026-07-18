import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Apple, Activity, Droplet, Compass, Heart, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export const Home: React.FC = () => {
  const { token } = useAuth();

  // If already logged in, redirect straight to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-between">
      {/* Top abstract gradient glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_55%)]" />

      {/* Hero section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-6">
          <Heart className="h-3.5 w-3.5 fill-emerald-500 stroke-emerald-600" />
          Smart Nutrition Companion
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none max-w-4xl">
          Fuel Your Body, <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Elevate Your Life
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl font-light">
          Track meals, monitor hydration, compute custom wellness scores, and get curated nutrient suggestions tailored specifically to your body.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-medium text-white hover:bg-emerald-600 active:scale-95 transition shadow-lg shadow-emerald-500/25"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Feature Grid */}
        <section className="mt-24 w-full">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">Designed for Your Health Journey</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5">
                <Apple className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Meal Tracker</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Log breakfast, lunch, dinner, and snacks. Get automatic totals for calories, proteins, carbs, and fats.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
                <Droplet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Water Tracker</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Log daily water consumption. Keep up with hydration targets using visual progress indicators.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-5">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">BMI Calculator</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Calculate Body Mass Index and instantly unlock custom suggestions for underweight, normal, or overweight goals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Healthy Recipes</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Access curated meal recommendations stored locally. No external APIs needed.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl items-center text-left">
          <div className="space-y-6">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Secure, Local & Fully Private Nutrition Analytics
            </h3>
            <p className="text-slate-600 leading-relaxed">
              We respect your health data. All metrics are stored safely, using secure password hashing and industry-standard JWT authentication.
            </p>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700">BCrypt-hashed passwords for absolute safety</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700">Dynamic targets based on the Harris-Benedict formulas</span>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-xl" />
            <div className="relative bg-white border border-slate-100 rounded-2xl p-8 shadow-sm w-full max-w-sm">
              <div className="border-b border-slate-50 pb-5 mb-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nutritional targets</span>
                <p className="text-2xl font-black text-slate-900 mt-1">2,000 Kcal / day</p>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                    <span>Protein</span>
                    <span>130g</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                    <span>Carbs</span>
                    <span>220g</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                    <span>Fat</span>
                    <span>65g</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} NutriGuide. Powered by the MERN Stack. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
