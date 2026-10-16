"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { Order } from "@/src/types/order";

interface Props {
  order: Order;
}

// One code per seller in the order. Shown until all of that seller's items
// are delivered - after that there's nothing left to hand over.
export default function DeliveryCodes({ order }: Props) {
  const [revealed, setRevealed] = useState(false);

  const pending = (order.shipping ?? []).filter((shipment) => {
    if (!shipment.deliveryCode) return false;
    const items = order.items.filter((item) => item.product.store?.id === shipment.storeId);
    return items.some((item) => item.status !== "DELIVERED" && item.status !== "CANCELLED");
  });

  if (order.status === "PENDING" || order.status === "CANCELLED" || pending.length === 0) return null;

  const storeName = (storeId: string) =>
    order.items.find((item) => item.product.store?.id === storeId)?.product.store?.name ?? "Seller";

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/60 p-5 dark:border-violet-500/30 dark:bg-violet-500/10 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
            <KeyRound size={17} />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Delivery code{pending.length > 1 ? "s" : ""}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              Give this to the person delivering your order <strong className="text-ink-2">only once you have your items</strong>. It
              confirms you received them.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-violet-700 hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-500/15"
          aria-pressed={revealed}
        >
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          {revealed ? "Hide" : "Show"}
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        {pending.map((shipment) => (
          <div key={shipment.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
            <p className="min-w-0 truncate text-[13px] text-muted">{storeName(shipment.storeId)}</p>
            <p
              className="font-[family-name:var(--font-mono)] text-[22px] font-bold tracking-[0.3em] text-violet-700 dark:text-violet-300"
              aria-label={revealed ? `Code ${shipment.deliveryCode}` : "Code hidden"}
            >
              {revealed ? shipment.deliveryCode : "••••••"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
