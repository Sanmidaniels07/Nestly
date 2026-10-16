"use client";

import { Check } from "lucide-react";

interface Props {
  delivery: boolean;
  pickup: boolean;
  onDeliveryChange: (value: boolean) => void;
  onPickupChange: (value: boolean) => void;
}

export default function DeliveryFilter({ delivery, pickup, onDeliveryChange, onPickupChange }: Props) {
  const options = [
    { label: "Delivery available", checked: delivery, onToggle: () => onDeliveryChange(!delivery) },
    { label: "Pickup available", checked: pickup, onToggle: () => onPickupChange(!pickup) },
  ];

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.label}
          onClick={option.onToggle}
          className={`
            flex w-full items-center justify-between rounded-xl border p-3.5 text-[13.5px] font-medium transition-colors
            ${option.checked ? "border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300" : "border-line text-ink-2 hover:border-violet-200 dark:hover:border-violet-500/30"}
          `}
        >
          {option.label}
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
              option.checked ? "border-violet-600 bg-violet-600" : "border-line-strong bg-surface"
            }`}
          >
            {option.checked && <Check size={13} className="text-white" strokeWidth={3} />}
          </div>
        </button>
      ))}
    </div>
  );
}