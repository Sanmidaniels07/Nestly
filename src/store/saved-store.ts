"use client";

import { create } from "zustand";

import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface SavedStore {
  items: MarketplaceProduct[];

  add: (product: MarketplaceProduct) => void;

  remove: (id: string) => void;

  isSaved: (id: string) => boolean;

  clear: () => void;
}

export const useSavedStore = create<SavedStore>((set, get) => ({

  items: [],

  add: (product) =>
    set((state) => {

      if (
        state.items.some((item) => item.id === product.id)
      ) {
        return state;
      }

      return {
        items: [...state.items, product],
      };
    }),

  remove: (id) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.id !== id
      ),
    })),

  isSaved: (id) =>
    get().items.some(
      (item) => item.id === id
    ),

  clear: () =>
    set({
      items: [],
    }),
}));