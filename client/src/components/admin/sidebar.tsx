// components/admin/Sidebar.tsx
"use client";

import { useSidebar } from "@/context/sidebarContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/users",     label: "Users",      icon: "👥" },
  { href: "/admin/products",  label: "Products",   icon: "📦" },
  { href: "/admin/orders",    label: "Orders",     icon: "🛒" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 top-16 bg-black/10 z-20"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 z-30 flex flex-col
        w-56 bg-gray-900 text-white
        transition-transform duration-300
        h-[calc(70vh-4rem)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-gray-700">
          <span className="text-xl font-bold tracking-tight">StyleMart Admin</span>
          <button
            onClick={close}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-5 py-3 text-sm font-medium
                  border-l-4 transition-colors
                  ${isActive
                    ? "bg-gray-800 border-indigo-500 text-white"
                    : "border-transparent text-gray-400 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-5 py-5 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className=" py-3 px-6 rounded-lg bg-red-500 hover:bg-red-700 text-white text-sm font-medium transition"
          >
          Logout
          </button>
        </div>
      </aside>
    </>
  );
}