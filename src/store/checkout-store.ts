"use client";

import { create } from "zustand";

import { DeliveryOption } from "@/src/types/delivery";
import { Address } from "../types/shipping-address";

export type PaymentMethod = "card" | "bank" | "wallet";

interface CheckoutStore {
  selectedAddress?: Address;

  selectedDelivery?: DeliveryOption;

  coupon?: string;

  paymentMethod: PaymentMethod;

  orderNote: string;

  setAddress: (address: Address) => void;

  setDelivery: (delivery: DeliveryOption) => void;

  setCoupon: (coupon: string) => void;

  clearCoupon: () => void;

  setPaymentMethod: (paymentMethod: PaymentMethod) => void;

  setOrderNote: (note: string) => void;

  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  paymentMethod: "card",

  orderNote: "",

  setAddress: (address) =>
    set({
      selectedAddress: address,
    }),

  setDelivery: (delivery) =>
    set({
      selectedDelivery: delivery,
    }),

  setCoupon: (coupon) =>
    set({
      coupon,
    }),

  clearCoupon: () =>
    set({
      coupon: undefined,
    }),

  setPaymentMethod: (paymentMethod) =>
    set({
      paymentMethod,
    }),

  setOrderNote: (orderNote) =>
    set({
      orderNote,
    }),

  resetCheckout: () =>
    set({
      selectedAddress: undefined,
      selectedDelivery: undefined,
      paymentMethod: "card",
      coupon: undefined,
      orderNote: "",
    }),
}));