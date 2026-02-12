import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", sales: 12, orders: 5 },
  { month: "Feb", sales: 19, orders: 15 },
  { month: "Mar", sales: 8, orders: 12 },
  { month: "Apr", sales: 15, orders: 20 },
  { month: "May", sales: 22, orders: 18 },
  { month: "Jun", sales: 30, orders: 25 },
];

export default function Analatics() {
  return (
    <div className={`w-full lg:w-120`}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#1976d2" />
          <Bar dataKey="orders" fill="#f50057" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
