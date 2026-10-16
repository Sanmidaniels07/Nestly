"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import { Order } from "@/src/types/order";

interface Props {
  order: Order;
}

export default function OrderTimeline({ order }: Props) {
  const timeline = order.timeline ?? [];

  return (
    <section className="rounded-2xl border border-line bg-surface p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Order timeline
      </h2>

      <div className="mt-6 space-y-5">
        {timeline.map((step, index) => {
          const isLast = index === timeline.length - 1;

          return (
            <div key={index} className="relative flex gap-4">
              {!isLast && (
                <div
                  className={`absolute left-[10.5px] top-6 h-full w-[2px] ${
                    step.completed ? "bg-emerald-200 dark:bg-emerald-500/25" : "bg-track"
                  }`}
                />
              )}

              <div className="relative z-10 shrink-0 bg-surface">
                {step.completed ? (
                  <CheckCircle2 size={21} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Clock3 size={21} className="text-faint" />
                )}
              </div>

              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[13.5px] font-semibold text-ink">{step.title}</h3>
                  {step.date && (
                    <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">
                      {step.date}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="mt-0.5 text-[13px] leading-6 text-muted">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
