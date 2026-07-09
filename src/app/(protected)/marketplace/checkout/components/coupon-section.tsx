"use client";

import { useState } from "react";
import { Check, Tag, X } from "lucide-react";
import { useCheckoutStore } from "@/src/store/checkout-store";
import Input from "@/src/components/ui/input";

export default function CouponSection() {
  const coupon = useCheckoutStore((state) => state.coupon);
  const setCoupon = useCheckoutStore((state) => state.setCoupon);
  const clearCoupon = useCheckoutStore((state) => state.clearCoupon);

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const code = value.trim();
    if (!code) return;

    // TODO: replace with real coupon validation against your backend
    setCoupon(code);
    setValue("");
    setError("");
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <Tag className="text-violet-600" size={16} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-[#13131A]">Coupon</h2>
          <p className="text-[13px] text-[#64748B]">Apply a discount voucher.</p>
        </div>
      </div>

      {coupon ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[13.5px] font-medium text-emerald-700">
            <Check size={15} />
            <span className="font-[family-name:var(--font-mono)]">{coupon}</span> applied
          </div>
          <button onClick={clearCoupon} aria-label="Remove coupon" className="text-emerald-600 hover:text-emerald-800">
            <X size={15} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Enter coupon code"
              error={error}
            />
          </div>

          <button
            onClick={handleApply}
            disabled={!value.trim()}
            className="h-12 shrink-0 rounded-xl bg-violet-600 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      )}
    </section>
  );
}