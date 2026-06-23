"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id as string);
        setOrder(data);
      } catch {
        setError("Order not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading order...</p>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500 text-lg">{error || "Order not found."}</p>
      <Link href="/orders" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
        My Orders
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-500 mt-2">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <div className="mt-3 inline-block bg-gray-100 text-gray-600 text-sm px-4 py-1 rounded-full font-mono">
          {order._id}
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-center mb-8">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColors[order.status]}`}>
          Status: {order.status}
        </span>
      </div>

      {/* Order Items */}
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs. {order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
        <div className="text-gray-600 space-y-1 text-sm">
          <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
        </div>
      </div>

      {/* Payment */}
      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-3">Payment</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Method</span>
          <span className="font-medium">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">Status</span>
          <span className={`font-medium ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}>
            {order.isPaid ? "Paid ✅" : "Pending ⏳"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/products"
          className="border border-black px-6 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="bg-indigo-400 text-white px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          📦 View My Orders
        </Link>
      </div>

    </div>
  );
}