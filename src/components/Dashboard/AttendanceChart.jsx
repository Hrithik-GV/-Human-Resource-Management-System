import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle } from "../UI/Card";

export const AttendanceChart = ({ title = "Attendance Overview", data = [] }) => {
  // Demo default data if none is provided
  const chartData = data.length > 0 ? data : [
    { name: "Mon", hours: 8.5 },
    { name: "Tue", hours: 9.0 },
    { name: "Wed", hours: 8.0 },
    { name: "Thu", hours: 9.2 },
    { name: "Fri", hours: 8.8 },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="h-[250px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b6be8" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b6be8" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#3b6be8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHours)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default AttendanceChart;
