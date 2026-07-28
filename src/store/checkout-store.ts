"use client";

import { create } from "zustand";

// Legacy delivery/coupon/payment-method concepts — kept for when the backend
// adds support for them. Not part of the real checkout flow today.
import { DeliveryOption } from "@/src/types/delivery";
import { Address as LegacyAddress } from "@/src/types/shipping-address";
import { CouponType } from "@/src/types/coupon";

export type PaymentMethod = "card" | "bank" | "wallet";

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  type: CouponType;
  value: number;
}

export interface ShippingSelection {
  shippingOptionId: string;
  fee: number;
}

interface CheckoutStore {
  // Real checkout flow (wired to POST /checkout/initiate)
  addressId?: string;
  setAddressId: (addressId: string) => void;

  // storeId -> selected shipping option, one per store present in the cart
  shippingSelections: Record<string, ShippingSelection>;
  setShippingSelection: (storeId: string, selection: ShippingSelection) => void;

  appliedCoupon?: AppliedCoupon;
  setAppliedCoupon: (coupon: AppliedCoupon) => void;
  clearAppliedCoupon: () => void;

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

  shippingSelections: {},
  setShippingSelection: (storeId, selection) =>
    set((state) => ({
      shippingSelections: { ...state.shippingSelections, [storeId]: selection },
    })),

  appliedCoupon: undefined,
  setAppliedCoupon: (appliedCoupon) => set({ appliedCoupon }),
  clearAppliedCoupon: () => set({ appliedCoupon: undefined }),

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
      shippingSelections: {},
      appliedCoupon: undefined,
      selectedAddress: undefined,
      selectedDelivery: undefined,
      paymentMethod: "card",
      coupon: undefined,
      orderNote: "",
    }),
}));
