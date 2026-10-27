import { CircleAlert } from "lucide-react";

import { Order } from "@/src/types/order";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

// Nestly cancelled this paid order because the item sold out to someone
// else just before the payment landed - say so, and where the money is.
export default function SoldOutNotice({ order }: { order: Order }) {
  if (!order.cancelReason) return null;

  return (
    <section className="flex gap-3.5 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
      <CircleAlert size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-ink">Sorry, it sold out</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-3">
          {order.cancelReason} This order was cancelled and nothing will be sent.
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
          {order.refundStatus === "FAILED"
            ? `Our team is refunding your ${money(order.total)} by hand and will email you once it's sent.`
            : `Your ${money(order.total)} is on its way back to the card or account you paid with. Refunds usually arrive within 5-10 business days, depending on your bank.`}
        </p>
      </div>
    </section>
  );
}
