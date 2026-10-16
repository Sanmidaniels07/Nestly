"use client";

import { useState } from "react";
import { Check, Tag, X } from "lucide-react";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { useValidateCoupon } from "@/src/hooks/use-validate-coupon";
import Input from "@/src/components/ui/input";

export default function CouponSection() {
  const appliedCoupon = useCheckoutStore((state) => state.appliedCoupon);
  const setAppliedCoupon = useCheckoutStore((state) => state.setAppliedCoupon);
  const clearAppliedCoupon = useCheckoutStore((state) => state.clearAppliedCoupon);

  const [value, setValue] = useState("");
  const { mutate: validateCoupon, isPending } = useValidateCoupon();

  const handleApply = () => {
    const code = value.trim();
    if (!code) return;

    validateCoupon(code, {
      onSuccess: (response) => {
        setAppliedCoupon({
          code: response.data.coupon.code,
          discountAmount: response.data.discountAmount,
          type: response.data.coupon.type,
          value: response.data.coupon.value,
        });
        setValue("");
      },
    });
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <Tag className="text-violet-600 dark:text-violet-400" size={16} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Coupon</h2>
          <p className="text-[13px] text-muted">Apply a discount voucher.</p>
        </div>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3">
          <div className="flex items-center gap-2 text-[13.5px] font-medium text-emerald-700 dark:text-emerald-300">
            <Check size={15} />
            <span className="font-[family-name:var(--font-mono)]">{appliedCoupon.code}</span> applied
          </div>
          <button
            onClick={clearAppliedCoupon}
            aria-label="Remove coupon"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Enter coupon code"
            />
          </div>

          <button
            onClick={handleApply}
            disabled={!value.trim() || isPending}
            className="h-12 shrink-0 rounded-xl bg-violet-600 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "Checking..." : "Apply"}
          </button>
        </div>
      )}
    </section>
  );
}
