"use client";

import CheckoutHeader from "./components/checkout-header";
import CheckoutStepper from "./components/checkout-stepper";
import CheckoutSummary from "./components/checkout-summary";
import OrderItems from "./components/order-item";
import ShippingAddress from "./components/shipping-address";
import StoreShipping from "./components/store-shipping";
import CouponSection from "./components/coupon-section";
import SellerNotes from "./components/seller-notes";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { useFormDraft } from "@/src/hooks/use-form-draft";
import { useCart } from "@/src/hooks/use-cart";

export default function CheckoutPage() {
  // Notes to sellers live in the checkout store (they're sent from the payment
  // page), so keep them in this browser too - a refresh or logging out brings
  // them back. The payment page forgets them once the order goes through.
  const sellerNotes = useCheckoutStore((state) => state.sellerNotes);
  const setSellerNote = useCheckoutStore((state) => state.setSellerNote);
  const { data: items } = useCart();
  useFormDraft(
    "checkout:notes",
    sellerNotes,
    (saved) => {
      // Only sellers still in the cart (a note for anyone else would be sent
      // with the order), and never over a note typed since.
      const inCart = new Set(items?.map((item) => item.product.storeId));
      Object.entries(saved).forEach(([storeId, note]) => {
        if (note && inCart.has(storeId) && !useCheckoutStore.getState().sellerNotes[storeId]) setSellerNote(storeId, note);
      });
    },
    { ready: !!items, isEmpty: (notes) => Object.values(notes).every((note) => !note.trim()) }
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
      <CheckoutHeader />

      <CheckoutStepper step={2} />

      <div className="grid gap-8 xl:grid-cols-[1.8fr_420px]">
        <section className="min-w-0 space-y-6">
          <ShippingAddress />

          <OrderItems />

          <StoreShipping />

          <SellerNotes />

          <CouponSection />
        </section>

        <CheckoutSummary />
      </div>
    </div>
  );
}
