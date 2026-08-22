import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { ToastWrapper } from '../components/ui/ToastWrapper';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      <ToastWrapper />

      {/* Left Brand Panel (Desktop split, Tablet/Mobile hero banner) */}
      <div className="lg:w-1/2 bg-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Decorative Pattern */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">Dayflow</span>
        </div>

        {/* Hero Section */}
        <div className="my-12 lg:my-0 max-w-lg z-10 space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Streamline your workforce & HR operations seamlessly.
          </h1>
          <p className="text-sm lg:text-base text-slate-300 font-normal leading-relaxed">
            Dayflow empowers organizations with modern attendance tracking, leave requests, payroll processing, and comprehensive employee management.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Real-time attendance & automated leave approvals</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Role-based access control for employees & administrators</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Users className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Centralized directory & payroll records</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Dayflow HRMS. All rights reserved.
        </div>
      </div>

      {/* Right Form Container (Tablet centered, Mobile stacked) */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
