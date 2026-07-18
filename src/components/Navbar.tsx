import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Apple, LogOut, Menu, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 md:hidden focus:outline-none"
            id="mobile-sidebar-toggle"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
              <Apple className="h-5 w-5" />
            </div>
            <span className="font-semibold text-slate-950 tracking-tight text-lg">
              Nutri<span className="text-emerald-500 font-extrabold">Guide</span>
            </span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full bg-slate-50 py-1.5 pl-2 pr-3.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <span className="max-w-[100px] truncate">{user.name}</span>
            </Link>

            <button
              onClick={logout}
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              title="Sign Out"
              id="navbar-sign-out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
