"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// The cart of someone shopping without an account, kept in this browser.
// Prices and stock aren't stored - the cart page asks the API for them
// (POST /checkout/guest/quote). When they log in or sign up, it moves into
// their account cart (components/guest-checkout/guest-cart-sync).

export interface GuestCartLine {
  productId: string;
  variationId: string | null;
  quantity: number;
}

interface GuestCartState {
  lines: GuestCartLine[];
  add: (line: GuestCartLine) => void;
  setQuantity: (productId: string, variationId: string | null, quantity: number) => void;
  remove: (productId: string, variationId: string | null) => void;
  clear: () => void;
}

const same = (line: GuestCartLine, productId: string, variationId: string | null) =>
  line.productId === productId && (line.variationId ?? null) === (variationId ?? null);

// The API takes up to 50 lines.
const MAX_LINES = 50;

export const useGuestCart = create<GuestCartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => same(l, line.productId, line.variationId));
          if (existing) {
            return {
              lines: state.lines.map((l) => (l === existing ? { ...l, quantity: l.quantity + line.quantity } : l)),
            };
          }
          return { lines: [...state.lines, line].slice(-MAX_LINES) };
        }),
      setQuantity: (productId, variationId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (same(l, productId, variationId) ? { ...l, quantity: Math.max(1, quantity) } : l)),
        })),
      remove: (productId, variationId) =>
        set((state) => ({ lines: state.lines.filter((l) => !same(l, productId, variationId)) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "nestly:guest-cart:v1", storage: createJSONStorage(() => localStorage) }
  )
);

export const guestCartCount = (lines: GuestCartLine[]) => lines.reduce((sum, line) => sum + line.quantity, 0);
