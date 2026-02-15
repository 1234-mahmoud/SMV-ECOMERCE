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

const chartData = [
  { month: "Jan", sales: 12, orders: 5 },
  { month: "Feb", sales: 19, orders: 15 },
  { month: "Mar", sales: 8, orders: 12 },
  { month: "Apr", sales: 15, orders: 20 },
  { month: "May", sales: 22, orders: 18 },
  { month: "Jun", sales: 30, orders: 25 },
];

export default function Analatics() {
  const [stats, setStats] = useState({
    usersCount: 0,
    sellersCount: 0,
    productsCount: 0,
    categoriesCount: 0,
    adminsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch {
        setStats({
          usersCount: 0,
          sellersCount: 0,
          productsCount: 0,
          categoriesCount: 0,
          adminsCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={`w-full lg:w-120 flex flex-col gap-6`}>
      {/* Real stats from DB */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          <span className="col-span-full text-gray-500">Loading stats...</span>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Users</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.usersCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Sellers</p>
              <p className="text-2xl font-bold text-green-600">{stats.sellersCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Products</p>
              <p className="text-2xl font-bold text-blue-600">{stats.productsCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold text-amber-600">{stats.categoriesCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Admins</p>
              <p className="text-2xl font-bold text-violet-600">{stats.adminsCount}</p>
            </div>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
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
