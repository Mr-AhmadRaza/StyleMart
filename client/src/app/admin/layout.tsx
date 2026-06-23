"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSidebar } from "@/context/sidebarContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const { isOpen, close, toggle } = useSidebar(); // ← must use this, no local sidebarOpen state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    const timer = setTimeout(() => setChecking(false), 0);
    return () => clearTimeout(timer);
  }, []);

  if (checking) return <p>Loading...</p>;

return (
  <div className="flex  ">  {/* ← add bg-gray-900 */}
    
    <main className={`flex-1 p-6 bg-gray-50 transition-all duration-300 ${isOpen ? "ml-56" : "ml-0"}`}>
      {children}
    </main>
  </div>
);
}