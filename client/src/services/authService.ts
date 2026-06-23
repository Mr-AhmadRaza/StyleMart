import api from "@/lib/api";
import { AuthResponse, User } from "@/types";

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    // Save token immediately after login
    localStorage.setItem("token", data.token);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get("/auth/me");
    return data.user;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};