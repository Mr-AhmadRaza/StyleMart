"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: {
    _id: string;
    user: { name: string; email: string };
    totalPrice: number;
    status: string;
    createdAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

// ✅ Moved OUTSIDE DashboardPage — fixes the error
const StatCard = ({ label, value, icon, color }: {
  label: string; value: string | number; icon: string; color: string;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
    <div className={`text-3xl p-4 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get("/orders"),
          api.get("/products"),
          api.get("/admin/users"),
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data;
        const users = usersRes.data;

        // ✅ After
        const totalRevenue = orders.reduce(
          (sum: number, o: { totalPrice: number }) => sum + o.totalPrice, 0
        );

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalUsers: users.length,
          totalRevenue,
          recentOrders: orders.slice(0, 5),
        });
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">{error}</div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with StyleMart.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Revenue" value={`Rs. ${stats?.totalRevenue.toLocaleString()}`} icon="💰" color="bg-green-50" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon="📦" color="bg-blue-50" />
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} icon="🛍️" color="bg-purple-50" />
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon="👥" color="bg-orange-50" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <button onClick={() => router.push("/admin/orders")} className="text-sm text-indigo-600 hover:underline">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{order.user?.name ?? "Guest"}</p>
                    <p className="text-gray-400 text-xs">{order.user?.email ?? "—"}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    Rs. {order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}