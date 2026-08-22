import React from "react";
import { useApp } from "../../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { StatCard } from "../../components/Dashboard/StatCard";
import { FileBarChart2, Users, CalendarCheck, TrendingUp, CreditCard } from "lucide-react";

export const Reports = () => {
  const { employees, leaves, payroll, attendance } = useApp();

  // Employee report indicators
  const totalEmp = employees.length;
  const activeEmp = employees.filter((e) => e.status === "Active").length;
  const leavesApplied = leaves.length;
  const leavesApproved = leaves.filter((l) => l.status === "Approved").length;

  const totalPayrollCost = payroll.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  // Clean Chart Data 1: Monthly Payout Trends
  const payoutData = [
    { month: "Jan", cost: 950000 },
    { month: "Feb", cost: 1100000 },
    { month: "Mar", cost: 1050000 },
    { month: "Apr", cost: 1200000 },
    { month: "May", cost: 1150000 },
    { month: "Jun", cost: 1250000 },
    { month: "Jul", cost: totalPayrollCost || 1350000 },
  ];

  // Clean Chart Data 2: Leave types comparison
  const leaveData = [
    { name: "Paid Leave", approved: 12, pending: 4 },
    { name: "Sick Leave", approved: 8, pending: 2 },
    { name: "Unpaid Leave", approved: 3, pending: 1 },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Reports</h2>
        <p className="text-xs text-slate-400 mt-1">Review organizational reports covering personnel, payroll histories, and leave rates.</p>
      </div>

      {/* Reports Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Ratio" value={`${((activeEmp / totalEmp) * 100).toFixed(0)}%`} icon={Users} description="Staff currently active" />
        <StatCard title="Leave Approval Rate" value={`${((leavesApproved / leavesApplied) * 100).toFixed(0)}%`} icon={CalendarCheck} description="Percentage of requests approved" />
        <StatCard title="Total Payouts" value={formatCurrency(totalPayrollCost)} icon={CreditCard} description="Monthly operational salaries" />
        <StatCard title="Cost Growth" value="+4.8%" icon={TrendingUp} description="Trend compared to Q1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Company Payroll Trend (INR)</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payoutData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b6be8" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b6be8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/100000).toFixed(1)}L`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Area type="monotone" dataKey="cost" stroke="#3b6be8" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Requests Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Types Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="approved" name="Approved Days" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="pending" name="Pending Days" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Reports;
