"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">👤 My Profile</h1>

      <div className="border rounded-lg p-6 space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              user.role === "admin"
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-600"
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Full Name</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Member Since</span>
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-PK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 flex gap-3">
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}