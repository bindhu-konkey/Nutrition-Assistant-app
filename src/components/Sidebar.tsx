import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Apple,
  Droplet,
  Compass,
  User,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Meal Tracker', path: '/meals', icon: Apple },
    { name: 'Water Tracker', path: '/water', icon: Droplet },
    { name: 'BMI Calculator', path: '/bmi', icon: Activity },
    { name: 'Goal Management', path: '/goals', icon: TrendingUp },
    { name: 'Recipe Suggestions', path: '/recipes', icon: Compass },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile background backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile close button header */}
        <div className="flex h-16 items-center justify-between px-6 md:hidden">
          <span className="font-bold text-slate-900">Navigation</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="border-b border-slate-50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-slate-900 truncate leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/5'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-900'
                  }`}
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout bottom trigger */}
        <div className="border-t border-slate-50 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-5 w-5 text-slate-400 hover:text-rose-600" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
