"use client";

import { create } from "zustand";

import { MarketplaceProduct } from "@/src/mocks/marketplace";
import { CartItem } from "@/src/types/cart";

interface CartStore {
  items: CartItem[];
  savedItems: CartItem[];

  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  grandTotal: number;
  totalItems: number;

  addToCart: (
    product: MarketplaceProduct,
    quantity: number
  ) => void;

  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;

  setQuantity: (
    id: string,
    quantity: number
  ) => void;

  toggleSelection: (id: string) => void;

  moveToSaved: (id: string) => void;

  moveToCart: (id: string) => void;

  clearSavedItems: () => void;

  clearCart: () => void;

  isInCart: (id: string) => boolean;

  getCartItem: (
    id: string
  ) => CartItem | undefined;
}

const FREE_DELIVERY_THRESHOLD = 500_000;

const DELIVERY_FEE = 5_000;

const TAX_RATE = 0.075;

function computeTotals(items: CartItem[]) {
  const selectedItems = items.filter(
    (item) => item.selected
  );

  const subtotal = selectedItems.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  const totalItems = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD ||
    subtotal === 0
      ? 0
      : DELIVERY_FEE;

  const discount = 0;

  const tax = Math.round(
    (subtotal - discount) * TAX_RATE
  );

  const grandTotal =
    subtotal -
    discount +
    tax +
    deliveryFee;

  return {
    subtotal,
    deliveryFee,
    discount,
    tax,
    grandTotal,
    totalItems,
  };
}

export const useCartStore = create<CartStore>(
  (set, get) => ({
    items: [],

    savedItems: [],

    ...computeTotals([]),

    addToCart: (product, quantity) =>
      set((state) => {
        const existing = state.items.find(
          (item) =>
            item.product.id === product.id
        );

        const items = existing
          ? state.items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + quantity,
                      item.product.stock
                    ),
                  }
                : item
            )
          : [
              ...state.items,
              {
                product,
                quantity: Math.min(
                  quantity,
                  product.stock
                ),
                selected: true,
              },
            ];

        return {
          items,
          ...computeTotals(items),
        };
      }),

    removeFromCart: (id) =>
      set((state) => {
        const items = state.items.filter(
          (item) =>
            item.product.id !== id
        );

        return {
          items,
          ...computeTotals(items),
        };
      }),

    increaseQuantity: (id) =>
      set((state) => {
        const items = state.items.map((item) =>
          item.product.id === id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  item.product.stock
                ),
              }
            : item
        );

        return {
          items,
          ...computeTotals(items),
        };
      }),

    decreaseQuantity: (id) =>
      set((state) => {
        const items = state.items.map((item) =>
          item.product.id === id
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  item.quantity - 1
                ),
              }
            : item
        );

        return {
          items,
          ...computeTotals(items),
        };
      }),

    setQuantity: (
      id,
      quantity
    ) =>
      set((state) => {
        const items = state.items.map((item) =>
          item.product.id === id
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(1, quantity),
                  item.product.stock
                ),
              }
            : item
        );

        return {
          items,
          ...computeTotals(items),
        };
      }),

    toggleSelection: (id) =>
      set((state) => {
        const items = state.items.map((item) =>
          item.product.id === id
            ? {
                ...item,
                selected: !item.selected,
              }
            : item
        );

        return {
          items,
          ...computeTotals(items),
        };
      }),

    moveToSaved: (id) =>
      set((state) => {
        const item = state.items.find(
          (item) =>
            item.product.id === id
        );

        if (!item) return state;

        const items = state.items.filter(
          (item) =>
            item.product.id !== id
        );

        return {
          items,
          savedItems: [
            ...state.savedItems,
            item,
          ],
          ...computeTotals(items),
        };
      }),

    moveToCart: (id) =>
      set((state) => {
        const item = state.savedItems.find(
          (item) =>
            item.product.id === id
        );

        if (!item) return state;

        const savedItems =
          state.savedItems.filter(
            (item) =>
              item.product.id !== id
          );

        const items = [
          ...state.items,
          item,
        ];

        return {
          items,
          savedItems,
          ...computeTotals(items),
        };
      }),

    clearSavedItems: () =>
      set({
        savedItems: [],
      }),

    clearCart: () =>
      set({
        items: [],
        ...computeTotals([]),
      }),

    isInCart: (id) =>
      get().items.some(
        (item) =>
          item.product.id === id
      ),

    getCartItem: (id) =>
      get().items.find(
        (item) =>
          item.product.id === id
      ),
  })
);