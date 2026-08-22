import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles, Calendar, Clock, CheckCircle, Users } from 'lucide-react';
import { ToastWrapper } from '../components/ui/ToastWrapper';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      <ToastWrapper />

      {/* Left Side: Brand Panel with Light Background & Abstract Shapes */}
      <div className="lg:w-1/2 bg-slate-100/80 text-slate-900 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden border-r border-slate-200/80">
        {/* Subtle Minimal Abstract Shapes */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 bg-slate-200/50 rounded-full blur-xl pointer-events-none" />

        {/* Top Header / Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">DAYFLOW</span>
        </div>

        {/* Tagline & Abstract Feature Graphics */}
        <div className="my-12 lg:my-0 max-w-md z-10 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-full mb-3">
              Modern HR Management
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Every workday, perfectly aligned.
            </h1>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Streamline attendance tracking, leave approvals, payroll schedules, and employee records in one clean SaaS workspace.
          </p>

          {/* Abstract SVG Illustration */}
          <div className="p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Clock className="w-4 h-4" />
              </div>
              <span>Automated Attendance & Time Logs</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Calendar className="w-4 h-4" />
              </div>
              <span>Seamless Leave Request Management</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                <Users className="w-4 h-4" />
              </div>
              <span>Comprehensive Employee & Admin Controls</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Dayflow HRMS. All rights reserved.
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
