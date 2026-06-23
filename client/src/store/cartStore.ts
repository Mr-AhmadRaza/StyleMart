import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      addToCart: (product) => {
        const existing = get().items.find((i) => i._id === product._id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i._id === product._id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (id) =>
        set({ items: get().items.filter((i) => i._id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "stylemart-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);