import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Card, CardHeader, CardTitle } from "../UI/Card";

export const LeaveChart = ({ title = "Leave Distribution by Department", data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { name: "Engineering", count: 4, color: "#3b6be8" },
    { name: "Design", count: 2, color: "#638cf0" },
    { name: "HR", count: 3, color: "#a5b4fc" },
    { name: "Marketing", count: 1, color: "#cbd5e1" },
    { name: "Sales", count: 2, color: "#94a3b8" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="h-[250px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #f1f5f9",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                fontSize: "12px",
                color: "#1e293b",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#3b6be8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default LeaveChart;
