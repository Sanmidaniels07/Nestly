"use client";

import { MarketplaceOrder } from "@/src/mocks/order";
import { CreditCard, Receipt } from "lucide-react";

interface Props {
  order: MarketplaceOrder;
}

export default function PaymentDetails({ order }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Payment
      </h2>

      <div className="mt-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
            <CreditCard size={16} className="text-violet-700" />
          </div>
          <div>
            <p className="text-[12.5px] text-[#64748B]">Method</p>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#13131A]">
              {order.payment.method}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
            <Receipt size={16} className="text-violet-700" />
          </div>
          <div>
            <p className="text-[12.5px] text-[#64748B]">Reference</p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[#13131A]">
              {order.payment.reference}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}