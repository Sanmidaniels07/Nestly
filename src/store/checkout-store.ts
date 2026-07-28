"use client";

import { create } from "zustand";

// Legacy delivery/coupon/payment-method concepts — kept for when the backend
// adds support for them. Not part of the real checkout flow today.
import { DeliveryOption } from "@/src/types/delivery";
import { Address as LegacyAddress } from "@/src/types/shipping-address";

export type PaymentMethod = "card" | "bank" | "wallet";

interface CheckoutStore {
  // Real checkout flow (wired to POST /checkout/initiate)
  addressId?: string;
  setAddressId: (addressId: string) => void;

  // Legacy/pending-backend fields — not consumed by the real checkout flow
  selectedAddress?: LegacyAddress;
  selectedDelivery?: DeliveryOption;
  coupon?: string;
  paymentMethod: PaymentMethod;
  orderNote: string;

  setAddress: (address: LegacyAddress) => void;
  setDelivery: (delivery: DeliveryOption) => void;
  setCoupon: (coupon: string) => void;
  clearCoupon: () => void;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  setOrderNote: (note: string) => void;

  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  addressId: undefined,
  setAddressId: (addressId) => set({ addressId }),

  paymentMethod: "card",
  orderNote: "",

  setAddress: (address) => set({ selectedAddress: address }),

  setDelivery: (delivery) => set({ selectedDelivery: delivery }),

  setCoupon: (coupon) => set({ coupon }),

  clearCoupon: () => set({ coupon: undefined }),

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  setOrderNote: (orderNote) => set({ orderNote }),

  resetCheckout: () =>
    set({
      addressId: undefined,
      selectedAddress: undefined,
      selectedDelivery: undefined,
      paymentMethod: "card",
      coupon: undefined,
      orderNote: "",
    }),
}));
