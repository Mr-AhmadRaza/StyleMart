"use client";

import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    hasHydrated,
  } = useCartStore();

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push("/checkout");
  };

  // ✅ Wait for localStorage to load — prevents hydration error
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Your Cart Is Empty</h1>
        <Link
          href="/products"
          className="bg-indigo-400 text-white px-6 py-3 font-semibold rounded-full hover:bg-gray-800 transition"
        >
          Shop Now →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Your Cart ({totalItems()} items)
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 border rounded-lg p-4 items-center"
          >
            {/* Image */}
            <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-gray-500 text-sm">{item.category?.name}</p>
              <p className="font-bold mt-1">Rs. {item.price}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="w-8 h-8 border rounded hover:bg-gray-100 font-bold"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="w-8 h-8 border rounded hover:bg-gray-100 font-bold"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <p className="font-bold w-24 text-right">
              Rs. {(item.price * item.quantity).toFixed(2)}
            </p>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:text-red-700 text-sm ml-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 border-t pt-6 flex flex-col items-end gap-4">
        <div className="text-xl font-bold">
          Total: Rs. {totalPrice().toFixed(2)}
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="border border-black px-6 py-3 rounded hover:bg-gray-100 transition"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}