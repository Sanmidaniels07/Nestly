"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import SummaryRow from "./summary-row";
import PaymentSecurity from "./payment-security";
import { useCartStore } from "@/src/store/cart-store";
import { useCheckoutStore } from "@/src/store/checkout-store";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PaymentSummary() {
  const router = useRouter();
  const { subtotal, discount, deliveryFee, tax, grandTotal } = useCartStore();
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!paymentMethod) {
      setError("Select a payment method to continue.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      // TODO: replace with real payment intent / charge API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/marketplace/order-success");
    } catch {
      setError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <aside className="sticky top-24 space-y-5 self-start rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Payment summary
      </h2>

      <div className="space-y-3">
        <SummaryRow label="Subtotal" value={money(subtotal)} />
        {discount > 0 && <SummaryRow label="Discount" value={`-${money(discount)}`} tone="text-emerald-600" />}
        <SummaryRow label="Delivery" value={deliveryFee === 0 ? "Free" : money(deliveryFee)} />
        <SummaryRow label="VAT" value={money(tax)} />

        <div className="border-t border-dashed border-[#ECE9F6] pt-3">
          <SummaryRow label="Grand total" value={money(grandTotal)} bold />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={processing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing payment...
          </>
        ) : (
          `Pay ${money(grandTotal)}`
        )}
      </button>

      <PaymentSecurity />
    </aside>
  );
}