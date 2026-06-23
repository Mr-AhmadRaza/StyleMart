"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentMethod: string;
  shippingAddress: { street: string; city: string; country: string };
  createdAt: string;
}

const STATUSES = ["pending", "processing", "shipped", "delivered"] as const;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // GET /api/orders → getAllOrders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // PUT /api/orders/:id/status → updateOrderStatus
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: newStatus as Order["status"] } : o)
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setOpenDropdown(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <>
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{order.user?.name ?? "Guest"}</p>
                      <p className="text-gray-400 text-xs">{order.user?.email ?? "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.items?.length ?? 0} item(s)</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">Rs. {order.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{order.paymentMethod}</td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button onClick={() => setOpenDropdown(openDropdown === order._id ? null : order._id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer ${statusColors[order.status]}`}>
                          {order.status} ▾
                        </button>
                        {openDropdown === order._id && (
                          <div className="absolute z-10 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            {STATUSES.map((s) => (
                              <button key={s} onClick={() => handleStatusChange(order._id, s)}
                                className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-50 transition-colors ${order.status === s ? "font-semibold text-indigo-600" : "text-gray-700"}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr key={`${order._id}-expanded`}>
                      <td colSpan={6} className="bg-indigo-50 px-6 py-4">
                        <p className="font-semibold text-gray-700 mb-2 text-sm">Order Items</p>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-600">
                            <span>{item.name} × {item.quantity}</span>
                            <span className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}