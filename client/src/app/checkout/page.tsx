"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (items.length === 0) {
      router.push("/products");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const order = await orderService.createOrder({
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: form,
        totalPrice: totalPrice(),
        paymentMethod,
      });

      clearCart();
      router.push(`/order-confirmation/${order._id}`);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/products" className="bg-indigo-400 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Shipping Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+92 300 0000000"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Street, House No."
                className="w-full border rounded-lg px-3 py-2  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Rawalpindi"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="46000"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xl font-semibold mb-3 mt-6">Payment Method</h2>
              <div className="space-y-2">
                {["Cash on Delivery", "Bank Transfer"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
      ${paymentMethod === method
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
      ${paymentMethod === method ? "border-yellow-500" : "border-gray-300"}`}>
                      {paymentMethod === method && (
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      )}
                    </span>
                    {method}
                  </label>
                ))}

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition font-medium mt-4"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border rounded-lg p-5 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-sm">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>Rs. {totalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}