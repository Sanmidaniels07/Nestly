"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/src/hooks/use-cart";
import { useCheckoutStore } from "@/src/store/checkout-store";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutSummary() {
  const router = useRouter();
  const { data: items } = useCart();
  const addressId = useCheckoutStore((state) => state.addressId);
  const shippingSelections = useCheckoutStore((state) => state.shippingSelections);
  const appliedCoupon = useCheckoutStore((state) => state.appliedCoupon);

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const subtotal = items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;
  const deliveryFee = Object.values(shippingSelections).reduce(
    (sum, selection) => sum + selection.fee,
    0
  );
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const canProceed = !!addressId && totalItems > 0;

  return (
    <aside className="sticky top-24 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Order summary
      </h2>

      <div className="mt-5 space-y-3">
        <Row title="Items" value={totalItems.toString()} />
        <Row title="Subtotal" value={money(subtotal)} />
        {deliveryFee > 0 && <Row title="Shipping" value={money(deliveryFee)} />}
        {discountAmount > 0 && (
          <Row title={`Coupon (${appliedCoupon?.code})`} value={`-${money(discountAmount)}`} />
        )}
        <div className="border-t border-dashed border-[#ECE9F6] pt-3">
          <Row title="Estimated total" value={money(total)} />
        </div>
      </div>

      <p className="mt-3 text-[12px] text-[#94A3B8]">
        Final total is confirmed on the payment page.
      </p>

      <button
        disabled={!canProceed}
        onClick={() => router.push("/marketplace/payment")}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
      >
        Proceed to payment
      </button>

      {!canProceed && (
        <p className="mt-2.5 text-center text-[12px] text-[#94A3B8]">
          {!addressId ? "Select a delivery address." : "Your cart is empty."}
        </p>
      )}
    </aside>
  );
}

function Row({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13.5px] text-[#64748B]">{title}</span>
      <span className="font-[family-name:var(--font-mono)] text-[13.5px] text-[#334155]">
        {value}
      </span>
    </div>
  );
}
