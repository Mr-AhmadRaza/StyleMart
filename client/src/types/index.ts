export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  image?: string;
  category?: Category;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string; // ← make sure this exists
}