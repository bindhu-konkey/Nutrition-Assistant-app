import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { MealTracker } from './pages/MealTracker';
import { WaterTracker } from './pages/WaterTracker';
import { BMICalculator } from './pages/BMICalculator';
import { Goals } from './pages/Goals';
import { Recipes } from './pages/Recipes';
import { NotFound } from './pages/NotFound';

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium animate-pulse">Initializing NutriGuide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/10 selection:text-emerald-900 flex flex-col">
      {/* Top Header Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Responsive layout container */}
      <div className="flex flex-1">
        {/* Left Drawer / Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Scrollable primary content canvas */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-y-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meals"
              element={
                <ProtectedRoute>
                  <MealTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/water"
              element={
                <ProtectedRoute>
                  <WaterTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bmi"
              element={
                <ProtectedRoute>
                  <BMICalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
