"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Order } from "@/src/types/order";

interface Props {
  order: Order;
}

const STEP_COPY: Record<string, { title: string; description: string }> = {
  PENDING: { title: "Order placed", description: "We received your order." },
  PAID: { title: "Payment confirmed", description: "Your payment went through and the seller was notified." },
  PROCESSING: { title: "Being prepared", description: "The seller is getting your items ready." },
  SHIPPED: { title: "Shipped", description: "Your items are on the way." },
  DELIVERED: { title: "Delivered", description: "Your items were handed over." },
  CANCELLED: { title: "Cancelled", description: "This order was cancelled." },
};

const formatAt = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function OrderTimeline({ order }: Props) {
  const timeline = order.timeline ?? [];

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">Order timeline</h2>

      <ol className="mt-6 space-y-5">
        {timeline.map((entry, index) => {
          const isLast = index === timeline.length - 1;
          const copy = STEP_COPY[entry.step] ?? { title: entry.step, description: "" };
          const isCancelled = entry.step === "CANCELLED";

          return (
            <li key={entry.step} className="relative flex gap-4">
              {!isLast && (
                <div
                  className={`absolute left-[10.5px] top-6 h-full w-[2px] ${
                    entry.completed ? "bg-emerald-200 dark:bg-emerald-500/25" : "bg-track"
                  }`}
                />
              )}

              <div className="relative z-10 shrink-0 bg-surface">
                {isCancelled ? (
                  <XCircle size={21} className="text-red-500" />
                ) : entry.completed ? (
                  <CheckCircle2 size={21} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Clock3 size={21} className="text-faint" />
                )}
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                  <h3 className={`text-[13.5px] font-semibold ${entry.completed ? "text-ink" : "text-subtle"}`}>
                    {copy.title}
                  </h3>
                  {entry.at && (
                    <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">{formatAt(entry.at)}</span>
                  )}
                </div>
                {entry.completed && copy.description && (
                  <p className="mt-0.5 text-[13px] leading-6 text-muted">{copy.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
