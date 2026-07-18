import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mb-6">
        <HelpCircle className="h-10 w-10" />
      </div>

      <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-slate-600 max-w-sm font-light leading-relaxed">
        The biometric reading you are searching for does not exist in our system logs. Let's get you back on track!
      </p>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 active:scale-95 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
