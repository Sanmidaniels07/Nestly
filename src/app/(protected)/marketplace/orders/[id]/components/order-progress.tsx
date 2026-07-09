"use client";

import { MarketplaceOrder } from "@/src/mocks/order";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  order: MarketplaceOrder;
}

export default function OrderProgress({ order }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
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
                    step.completed ? "bg-emerald-200" : "bg-[#ECE9F6]"
                  }`}
                />
              )}

              <div className="relative z-10 shrink-0 bg-white">
                {step.completed ? (
                  <CheckCircle2 size={21} className="text-emerald-600" />
                ) : (
                  <Circle size={21} className="text-[#CBD5E1]" />
                )}
              </div>

              <div className="pb-1">
                <h3 className="text-[13.5px] font-semibold text-[#13131A]">{step.title}</h3>
                <p className="mt-0.5 text-[13px] text-[#64748B]">{step.description}</p>
                {step.date && (
                  <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
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