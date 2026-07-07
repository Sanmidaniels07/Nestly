"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, Tag, Truck, X } from "lucide-react";

import { useCartStore } from "@/src/store/cart-store";
import Input from "@/src/components/ui/input";

function money(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const deliveryFee = useCartStore((state) => state.deliveryFee);
  const discount = useCartStore((state) => state.discount);
  const tax = useCartStore((state) => state.tax);
  const grandTotal = useCartStore((state) => state.grandTotal);

  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    // TODO: replace with real coupon validation against your backend
    if (code === "WELCOME10") {
      setApplied(code);
      setError("");
      setCoupon("");
    } else {
      setError("Invalid or expired coupon code");
    }
  };

  const removeCoupon = () => {
    setApplied(null);
    setError("");
  };

  return (
    <aside className="sticky top-24 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        Order summary
      </h2>

      <div className="mt-6 space-y-3.5">
        <SummaryRow title={`Subtotal (${items.length} items)`} value={money(subtotal)} />
        <SummaryRow title="Delivery" value={deliveryFee === 0 ? "Free" : money(deliveryFee)} />
        <SummaryRow title="Discount" value={`-${money(discount)}`} />
        <SummaryRow title="VAT" value={money(tax)} />
      </div>

      <div className="my-6 border-t border-dashed border-[#ECE9F6]" />

      <SummaryRow title="Total" value={money(grandTotal)} bold />

      {/* Coupon */}
      <div className="mt-6">
        <label className="mb-2 block text-[13px] font-medium text-[#334155]">Coupon code</label>

        {applied ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 text-[13.5px] font-medium text-emerald-700">
              <Check size={15} />
              <span className="font-[family-name:var(--font-mono)]">{applied}</span> applied
            </div>
            <button onClick={removeCoupon} aria-label="Remove coupon" className="text-emerald-600 hover:text-emerald-800">
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                placeholder="Enter coupon"
                error={error}
              />
            </div>

            <button
              onClick={handleApplyCoupon}
              disabled={!coupon.trim()}
              className="flex h-12 items-center gap-1.5 rounded-xl bg-violet-50 px-4 text-[13px] font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Tag size={15} />
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Checkout */}
      <Link
        href="/marketplace/checkout"
        className="mt-6 flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white transition-all hover:brightness-110"
      >
        Proceed to checkout
      </Link>

      {/* Notes */}
      <div className="mt-6 space-y-3 text-[12.5px] text-[#64748B]">
        <div className="flex items-start gap-2.5">
          <Truck size={15} className="mt-0.5 shrink-0 text-violet-600" />
          Free delivery on orders above{" "}
          <span className="font-[family-name:var(--font-mono)]">₦500,000</span>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
          Secure payment protected with SSL encryption.
        </div>
      </div>
    </aside>
  );
}

interface SummaryRowProps {
  title: string;
  value: string;
  bold?: boolean;
}

function SummaryRow({ title, value, bold }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-[14px] font-semibold text-[#13131A]" : "text-[13.5px] text-[#64748B]"}>
        {title}
      </span>
      <span
        className={
          bold
            ? "font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700"
            : "font-[family-name:var(--font-mono)] text-[13.5px] text-[#334155]"
        }
      >
        {value}
      </span>
    </div>
  );
}