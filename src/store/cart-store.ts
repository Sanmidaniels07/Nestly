"use client";

import { create } from "zustand";

import { MarketplaceProduct } from "@/src/mocks/marketplace";

import { CartItem } from "@/src/types/cart";

interface CartStore {
  items: CartItem[];

  addToCart: (product: MarketplaceProduct) => void;

  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;

  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            product,
            quantity: 1,
            selected: true,
          },
        ],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.product.id !== id
      ),
    })),

  increaseQuantity: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      ),
    })),

  decreaseQuantity: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity - 1
              ),
            }
          : item
      ),
    })),

  clearCart: () =>
    set({
      items: [],
    }),
}));