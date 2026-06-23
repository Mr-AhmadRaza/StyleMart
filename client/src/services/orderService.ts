import api from "@/lib/api";
import { Order, ShippingAddress, OrderItem } from "@/types";

export const orderService = {
  createOrder: async (data: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    totalPrice: number;
    paymentMethod: string;
  }): Promise<Order> => {
    const { data: order } = await api.post("/orders", data);
    return order;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await api.get("/orders/my");
    return data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
};