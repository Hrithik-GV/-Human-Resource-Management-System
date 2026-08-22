import React from "react";
import { Card, CardHeader, CardTitle } from "../UI/Card";
import { Landmark, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const SalaryCard = ({ basicSalary = 0, allowances = 0, bonus = 0, deductions = 0, netSalary = 0 }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Net Salary Pay</CardTitle>
        <Landmark className="w-5 h-5 text-emerald-500" />
      </CardHeader>
      
      <div className="my-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(netSalary)}
        </span>
        <p className="text-xs text-slate-400 mt-1">Calculated Net Monthly Earnings</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-100 pt-4">
        <div>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> Total Earnings
          </span>
          <span className="text-sm font-bold text-slate-700">
            {formatCurrency(basicSalary + allowances + bonus)}
          </span>
        </div>
        <div>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" /> Deductions
          </span>
          <span className="text-sm font-bold text-slate-700">
            {formatCurrency(deductions)}
          </span>
        </div>
      </div>
    </Card>
  );
};
