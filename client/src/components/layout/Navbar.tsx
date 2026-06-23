"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "@/context/sidebarContext";

export default function Navbar() {
  const { totalItems, hasHydrated } = useCartStore();
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toggle,open } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  const cartCount = hasHydrated ? totalItems() : 0;
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(e.target as Node)) {
        setAuthDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDropdownOpen(false);
    router.push("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="px-13 flex justify-between items-center h-16">

        {/* Logo + Toggle */}
        <div className="flex items-center gap-3">
          {/* ☰ Toggle — only on admin pages */}

          {isAdmin && (
            <button
              onClick={toggle}
              className="bg-gray-800 text-white p-2 rounded-bl-4xl text-sm hover:bg-gray-700 transition"
            >
              ☰ 
            </button>
          )}
          <Link href="/" className="flex items-center px-2  gap-2">

            {/* Geometric diamond */}
            <svg width="36" height="50" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer diamond (stroke only) */}
              <path
                d="M18 2 L34 18 L18 34 L2 18 Z"
                stroke="#6366f1"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Inner diamond (filled) */}
              <path
                d="M18 9 L27 18 L18 27 L9 18 Z"
                fill="#111827"
              />
            </svg>
            <div className="flex items-center gap-[3px]">
              <div className="w-[3px] h-8 rounded-full bg-indigo-500" />
              <div className="w-[3px] h-8 rounded-full bg-gray-900" />
            </div>

            {/* Wordmark */}
            {/* <div className="flex flex-col leading-tight"> */}
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-black tracking-[0.25em] text-gray-900">STYLE</span>
              <span className="text-[13px] font-light tracking-[0.25em] text-indigo-500">MART</span>
            </div>
            <span className="text-[9px] font-medium tracking-[0.3em] text-gray-400 uppercase">Fashion Store</span>
            {/* </div>  */}
          </Link>


        </div>

        {/* Desktop Nav — hide on admin pages */}
        {!isAdmin && (
          <div className="hidden md:flex items-center px-13 gap-6">
            <Link href="/" className="hover:text-indigo-500 transition">Home</Link>
            <Link href="/about" className="hover:text-indigo-500 transition">About</Link>
            <Link href="/products" className="hover:text-indigo-500 transition">Products</Link>
            <Link href="/contact" className="hover:text-indigo-500 transition">Contact</Link>

            <Link href="/orders" className="hover:text-indigo-500 transition">Orders</Link>
            <Link href="/cart" className="relative flex items-center gap-1 hover:text-indigo-500 transition">
              <span className="text-xl">🛒</span>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/checkout" className="hover:text-indigo-500 transition">💳Checkout</Link>

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 hover:opacity-80 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.split(" ")[0]}
                      </span>
                      <span className="text-xs text-gray-400">▼</span>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          My Profile
                        </Link>

                        {user?.role === "admin" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() =>{
                              open();
                              setDropdownOpen(false)}}
                            className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition font-medium"
                          >
                            📊 Admin Dashboard
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                        >
                          Logout
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="relative" ref={authRef}>
                    <button
                      onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                      className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition"
                    >
                      Account
                      <span className={`text-xs transition-transform duration-200 ${authDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                    </button>

                    {authDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                        <Link
                          href="/auth/login"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          🔑 Login
                        </Link>
                        <Link
                          href="/auth/register"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          ✨ Register
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Mobile Right Side — hide on admin pages */}
        {!isAdmin && (
          <div className="flex md:hidden items-center gap-4">
            <Link href="/cart" className="relative flex items-center">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-1"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu — hide on admin pages */}
      {!isAdmin && menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link href="/" onClick={closeMenu} className="hover:text-indigo-500 transition py-1">Home</Link>
          <Link href="/about" onClick={closeMenu} className="hover:text-indigo-500 transition py-1">About</Link>
          <Link href="/products" onClick={closeMenu} className="hover:text-indigo-500 transition py-1">Products</Link>
          <Link href="/contact" onClick={closeMenu} className="hover:text-indigo-500 transition py-1">Contact</Link>
          <Link href="/cart" onClick={closeMenu} className="hover:text-indigo-500 transition py-1">
            Cart {cartCount > 0 && (
              <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="border-t border-gray-100 pt-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="text-sm border border-gray-200 px-3 py-2 rounded text-center hover:bg-gray-50 transition"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/auth/login"
                      onClick={closeMenu}
                      className="text-center border border-black py-2 rounded hover:bg-gray-100 transition text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={closeMenu}
                      className="text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}