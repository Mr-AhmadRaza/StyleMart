// lib/adminApi.ts
import api from "@/lib/api"; // ← your existing axios instance!

// Dashboard stats
export const getStats = () => api.get("/admin/stats");

// Users
export const getUsers   = ()           => api.get("/admin/users");
export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);

// Products
export const getProducts   = ()           => api.get("/admin/products");
export const deleteProduct = (id: string) => api.delete(`/admin/products/${id}`);

// Orders
export const getOrders     = ()                         => api.get("/admin/orders");
export const updateOrderStatus = (id: string, status: string) =>
  api.put(`/admin/orders/${id}`, { status });