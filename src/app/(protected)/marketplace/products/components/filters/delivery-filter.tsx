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
            ${option.checked ? "border-violet-300 bg-violet-50 text-violet-700" : "border-[#ECE9F6] text-[#334155] hover:border-violet-200"}
          `}
        >
          {option.label}
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
              option.checked ? "border-violet-600 bg-violet-600" : "border-[#D4D2E3] bg-white"
            }`}
          >
            {option.checked && <Check size={13} className="text-white" strokeWidth={3} />}
          </div>
        </button>
      ))}
    </div>
  );
}