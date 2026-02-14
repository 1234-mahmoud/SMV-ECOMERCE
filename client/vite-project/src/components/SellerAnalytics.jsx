import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SellerAnalytics() {
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    chartData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/seller/stats");
        setStats({
          productsCount: res.data.productsCount ?? 0,
          ordersCount: res.data.ordersCount ?? 0,
          chartData: Array.isArray(res.data.chartData) ? res.data.chartData : [],
        });
      } catch {
        setStats({ productsCount: 0, ordersCount: 0, chartData: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats.chartData.length > 0 ? stats.chartData : [
    { month: "Jan", sales: 0, orders: 0 },
    { month: "Feb", sales: 0, orders: 0 },
    { month: "Mar", sales: 0, orders: 0 },
    { month: "Apr", sales: 0, orders: 0 },
    { month: "May", sales: 0, orders: 0 },
    { month: "Jun", sales: 0, orders: 0 },
  ];

  return (
    <div className={`w-full flex flex-col gap-6`}>
      {/* Real stats from DB */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          <span className="col-span-full text-gray-500">Loading stats...</span>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">My Products</p>
              <p className="text-2xl font-bold text-blue-600">{stats.productsCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Orders (with my products)</p>
              <p className="text-2xl font-bold text-green-600">{stats.ordersCount}</p>
            </div>
          </>
        )}
      </div>
<div className={`w-full md:w-100`}>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" name="Sales" fill="#1976d2" />
          <Bar dataKey="orders" name="Orders" fill="#f50057" />
        </BarChart>
      </ResponsiveContainer>
</div>
    </div>
  );
}
