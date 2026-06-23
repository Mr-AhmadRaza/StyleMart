import api from "@/lib/api";
import { Product } from "@/types";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get("/products");
    return data;
  },

  getOne: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.post("/products", productData);
    return data;
  },

  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};