"use client";

import { MarketplaceOrder } from "@/src/mocks/order";


interface Props {
  order: MarketplaceOrder;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderSummary({ order }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Order summary
      </h2>

      <div className="mt-5 space-y-3">
        <SummaryRow label="Subtotal" value={money(order.subtotal)} />
        <SummaryRow
          label="Delivery"
          value={order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}
        />
        <SummaryRow label="Tax" value={money(order.tax)} />

        <div className="flex items-center justify-between border-t border-dashed border-[#ECE9F6] pt-3">
          <span className="text-[14px] font-semibold text-[#13131A]">Total</span>
          <span className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700">
            {money(order.total)}
          </span>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#64748B]">{label}</span>
      <span className="font-[family-name:var(--font-mono)] text-[13.5px] font-semibold text-[#334155]">
        {value}
      </span>
    </div>
  );
}