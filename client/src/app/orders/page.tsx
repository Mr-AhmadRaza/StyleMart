"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import Link from "next/link";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }
    if (user) {
      const fetchOrders = async () => {
        try {
          const data = await orderService.getMyOrders();
          setOrders(data);
        } finally {
          setFetching(false);
        }
      };
      fetchOrders();
    }
  }, [user, loading, router]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading orders...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-5 hover:shadow-md transition">

              {/* Order Header */}
              <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono">ID: {order._id}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center border-t pt-3 flex-wrap gap-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Payment: <span className="font-medium text-gray-700">{order.paymentMethod}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span className={`font-medium ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}>
                      {order.isPaid ? "Paid ✅" : "Unpaid ⏳"}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">Rs. {order.totalPrice.toFixed(2)}</p>
                  <Link
                    href={`/order-confirmation/${order._id}`}
                    className="text-sm text-indigo-500 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}