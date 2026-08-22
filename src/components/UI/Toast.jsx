import React from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Toast = ({ toast }) => {
  const { removeToast } = useApp();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const borders = {
    success: "border-emerald-100 bg-emerald-50/50",
    warning: "border-amber-100 bg-amber-50/50",
    error: "border-rose-100 bg-rose-50/50",
    info: "border-blue-100 bg-blue-50/50",
  };

  return (
    <div
      className={`flex items-center gap-3 w-full max-w-sm p-4 bg-white border rounded-xl shadow-premium-lg transition-all duration-300 animate-fade-in ${borders[toast.type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-800">{toast.message}</div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
};
