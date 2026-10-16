"use client";

import { Package, Truck, House, Check } from "lucide-react";

export type DeliveryStatus = "confirmed" | "shipping" | "delivered";

interface Props {
  status: DeliveryStatus;
}

const steps: { key: DeliveryStatus; label: string; icon: typeof Package }[] = [
  { key: "confirmed", label: "Confirmed", icon: Package },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "delivered", label: "Delivered", icon: House },
];

export default function DeliveryTimeline({ status }: Props) {
  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-ink">
        Delivery progress
      </h2>

      <div className="mt-7 flex items-center">
        {steps.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          const isUpcoming = index > activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-1 items-center last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-full transition-colors
                    ${
                      isDone
                        ? "bg-violet-600 text-white"
                        : isActive
                        ? "bg-violet-600 text-white ring-4 ring-violet-100 dark:ring-violet-500/20"
                        : "bg-surface-muted text-subtle"
                    }
                  `}
                >
                  {isDone ? <Check size={18} /> : <Icon size={18} />}
                </div>

                <p
                  className={`mt-2.5 text-[12.5px] font-medium ${
                    isUpcoming ? "text-subtle" : "text-ink"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-[3px] flex-1 rounded-full transition-colors ${
                    index < activeIndex ? "bg-violet-600" : "bg-track"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}