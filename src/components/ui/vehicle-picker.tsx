"use client";

import { Check } from "lucide-react";

import { DeliveryVehicle, VEHICLES } from "@/src/lib/delivery-vehicle";

interface Props {
  value: DeliveryVehicle | null;
  onChange: (vehicle: DeliveryVehicle) => void;
  // "cards" explains each choice (product form); "compact" is a one-line
  // segmented control (delivery zones).
  variant?: "cards" | "compact";
  label?: string;
}

// Dispatch bike / Car / Truck - how a product or a delivery zone travels.
export default function VehiclePicker({ value, onChange, variant = "compact", label }: Props) {
  if (variant === "compact") {
    return (
      <div role="radiogroup" aria-label={label ?? "Delivery vehicle"} className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
        {VEHICLES.map((vehicle) => {
          const selected = value === vehicle.id;
          return (
            <button
              key={vehicle.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(vehicle.id)}
              className={`flex h-10 items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium transition-all ${
                selected ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300" : "text-muted hover:text-ink"
              }`}
            >
              <vehicle.icon size={15} className={selected ? "text-violet-600 dark:text-violet-400" : "text-subtle"} />
              {vehicle.short}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label={label ?? "Delivery vehicle"} className="grid gap-2.5 sm:grid-cols-3">
      {VEHICLES.map((vehicle) => {
        const selected = value === vehicle.id;
        return (
          <button
            key={vehicle.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(vehicle.id)}
            className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors sm:flex-col sm:gap-2.5 ${
              selected
                ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/15 dark:bg-violet-500/10"
                : "border-line hover:border-violet-300 dark:hover:border-violet-500/40"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                selected ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white" : "bg-surface-2 text-ink-2"
              }`}
            >
              <vehicle.icon size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold text-ink">{vehicle.label}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{vehicle.examples}</span>
            </span>
            {selected && (
              <Check size={16} className="absolute right-3 top-3 text-violet-600 dark:text-violet-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
