"use client";

import { MarketplaceOrder } from "@/src/mocks/order";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  order: MarketplaceOrder;
}

export default function OrderProgress({ order }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Order progress
      </h2>

      <div className="mt-6 space-y-5">
        {order.timeline.map((step, index) => {
          const isLast = index === order.timeline.length - 1;

          return (
            <div key={index} className="relative flex gap-4">
              {!isLast && (
                <div
                  className={`absolute left-[10px] top-6 h-full w-[2px] ${
                    step.completed ? "bg-emerald-200 dark:bg-emerald-500/25" : "bg-track"
                  }`}
                />
              )}

              <div className="relative z-10 shrink-0 bg-surface">
                {step.completed ? (
                  <CheckCircle2 size={21} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle size={21} className="text-faint" />
                )}
              </div>

              <div className="pb-1">
                <h3 className="text-[13.5px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-0.5 text-[13px] text-muted">{step.description}</p>
                {step.date && (
                  <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">
                    {step.date}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}