import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { Sparkles, ArrowLeft } from "lucide-react";
import { PATHS } from "../constants/paths";

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-slate-50 text-slate-800 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-premium">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">DAYFLOW</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-brand-100 tracking-widest">404</h1>
          <span className="absolute top-[40%] left-[10%] text-sm font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full shadow-sm">
            Page Not Found
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Lost in the workflow?</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page you are looking for does not exist or has been relocated to another workspace index.
          </p>
        </div>

        <Link to={PATHS.LOGIN}>
          <Button variant="primary" className="flex items-center gap-2 py-2 px-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          © 2026 Dayflow Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
