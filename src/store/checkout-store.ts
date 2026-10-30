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

  // Number the seller calls to deliver; undefined = the address's phone.
  deliveryPhone?: string;
  setDeliveryPhone: (phone: string) => void;

  // storeId -> selected shipping option, one per store present in the cart
  shippingSelections: Record<string, ShippingSelection>;
  setShippingSelection: (storeId: string, selection: ShippingSelection) => void;
  clearShippingSelection: (storeId: string) => void;

  // storeId -> optional note from the buyer to that seller
  sellerNotes: Record<string, string>;
  setSellerNote: (storeId: string, note: string) => void;

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
  // A new address brings its own phone.
  setAddressId: (addressId) => set({ addressId, deliveryPhone: undefined }),

  deliveryPhone: undefined,
  setDeliveryPhone: (deliveryPhone) => set({ deliveryPhone }),

  shippingSelections: {},
  setShippingSelection: (storeId, selection) =>
    set((state) => ({
      shippingSelections: { ...state.shippingSelections, [storeId]: selection },
    })),
  clearShippingSelection: (storeId) =>
    set((state) => ({
      shippingSelections: Object.fromEntries(
        Object.entries(state.shippingSelections).filter(([id]) => id !== storeId)
      ),
    })),

  sellerNotes: {},
  setSellerNote: (storeId, note) =>
    set((state) => ({ sellerNotes: { ...state.sellerNotes, [storeId]: note } })),

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
      deliveryPhone: undefined,
      shippingSelections: {},
      sellerNotes: {},
      appliedCoupon: undefined,
      selectedAddress: undefined,
      selectedDelivery: undefined,
      paymentMethod: "card",
      coupon: undefined,
      orderNote: "",
    }),
}));

/**
 * Sellers in the cart with no delivery zone or pickup picked yet, by name.
 * Payment needs one for every seller (the API refuses the order otherwise).
 */
export const sellersMissingDelivery = (
  items: { product: { storeId: string; store?: { name?: string } | null } }[] | undefined,
  selections: Record<string, ShippingSelection>
) => {
  const names = new Map<string, string>();
  for (const item of items ?? []) {
    if (!selections[item.product.storeId]) names.set(item.product.storeId, item.product.store?.name ?? "a seller");
  }
  return [...names.values()];
};

/** "Raycakes", "Raycakes and Ola's Kitchen", "Raycakes, Ola's Kitchen and 2 more" */
export const listSellerNames = (names: string[]) =>
  names.length <= 2 ? names.join(" and ") : `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`;
