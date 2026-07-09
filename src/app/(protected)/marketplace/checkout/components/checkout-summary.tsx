"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/cart-store";
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

  const subtotal = useCartStore((state) => state.subtotal);
  const tax = useCartStore((state) => state.tax);
  const discount = useCartStore((state) => state.discount);
  const totalItems = useCartStore((state) => state.totalItems);

  const delivery = useCheckoutStore((state) => state.selectedDelivery);
  const address = useCheckoutStore((state) => state.selectedAddress);
  const coupon = useCheckoutStore((state) => state.coupon);

  const deliveryFee = delivery?.price ?? 0;
  const total = subtotal + deliveryFee + tax - discount;

  const canProceed = Boolean(address && delivery);

  return (
    <aside className="sticky top-24 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Order summary
      </h2>

      <div className="mt-5 space-y-3">
        <Row title="Items" value={totalItems.toString()} />
        <Row title="Subtotal" value={money(subtotal)} />
        <Row title="Delivery" value={delivery ? money(deliveryFee) : "—"} />
        <Row title="VAT" value={money(tax)} />
        {discount > 0 && <Row title="Discount" value={`-${money(discount)}`} tone="text-emerald-600" />}
        {coupon && <Row title="Coupon" value={coupon} tone="text-violet-600" mono />}
      </div>

      <div className="my-5 border-t border-dashed border-[#ECE9F6]" />

      <Row title="Total" value={money(total)} large />

      <button
        disabled={!canProceed}
        onClick={() => router.push("/marketplace/payment")}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
      >
        Proceed to payment
      </button>

      {!canProceed && (
        <p className="mt-2.5 text-center text-[12px] text-[#94A3B8]">
          {!address && !delivery
            ? "Select an address and delivery option."
            : !address
            ? "Select a delivery address."
            : "Select a delivery option."}
        </p>
      )}
    </aside>
  );
}

function Row({
  title,
  value,
  large = false,
  tone,
  mono = false,
}: {
  title: string;
  value: string;
  large?: boolean;
  tone?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={large ? "text-[14px] font-semibold text-[#13131A]" : "text-[13.5px] text-[#64748B]"}>
        {title}
      </span>
      <span
        className={`
          ${large ? "text-[18px] font-semibold text-violet-700" : "text-[13.5px] text-[#334155]"}
          ${tone ?? ""}
          ${large || mono ? "font-[family-name:var(--font-mono)]" : ""}
        `}
      >
        {value}
      </span>
    </div>
  );
}