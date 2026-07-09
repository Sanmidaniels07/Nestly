"use client";

import { orders } from "@/src/mocks/order";
import SummaryRow from "../../payment/components/summary-row";

const latestOrder = orders[0];

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderSummaryCard() {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Order summary
      </h2>

      <div className="mt-5 space-y-3">
        <SummaryRow label="Order number" value={latestOrder.orderNumber} />
        <SummaryRow label="Payment" value={latestOrder.paymentMethod} />
        <SummaryRow label="Order date" value={latestOrder.createdAt} />

        <div className="border-t border-dashed border-[#ECE9F6] pt-3">
          <SummaryRow label="Total paid" value={money(latestOrder.total)} bold />
        </div>
      </div>
    </section>
  );
}