"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartStore } from "../types";
import { CART_STORE_KEY } from "@/constants";


export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      increase: (id: number) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === id);
          return {
            items: exists
              ? state.items.map((i) =>
                  i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
                )
              : [...state.items, { id, quantity: 1 }],
          };
        }),

      decrease: (id: number) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),

      setItemQuantity: (ci: CartItem) =>
        set((state) => ({
          items:
            ci.quantity <= 0
              ? state.items.filter((i) => i.id !== ci.id)
              : state.items.map((i) =>
                  i.id === ci.id ? { ...i, quantity: ci.quantity } : i,
                ),
        })),

      counter: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: CART_STORE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;  
      }
    },
  ),
);
