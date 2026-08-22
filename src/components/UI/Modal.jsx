import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${sizes[size]} bg-white rounded-xl shadow-premium-lg border border-slate-100 p-6 z-10 animate-fade-in`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="!p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
