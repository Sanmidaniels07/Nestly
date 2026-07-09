"use client";

import { Truck, Zap, Store, CheckCircle2 } from "lucide-react";

import { DeliveryOption } from "@/src/types/delivery";

interface Props {
  option: DeliveryOption;
  selected: boolean;
  onSelect: () => void;
}

function money(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

const icons = {
  truck: Truck,
  zap: Zap,
  store: Store,
};

export default function DeliveryOptionCard({ option, selected, onSelect }: Props) {
  const Icon = icons[option.icon];

  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-2xl border p-5 text-left transition-colors ${
        selected
          ? "border-violet-600 bg-violet-50"
          : "border-[#ECE9F6] bg-white hover:border-violet-300"
      }`}
    >
      <div className="flex justify-between gap-4">
        <div className="flex gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              selected ? "bg-violet-600" : "bg-violet-50"
            }`}
          >
            <Icon size={18} className={selected ? "text-white" : "text-violet-700"} />
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-[#13131A]">{option.name}</h3>
            <p className="mt-1 text-[13px] text-[#64748B]">{option.description}</p>
            <p className="mt-1.5 text-[12.5px] font-medium text-[#475569]">
              {option.duration}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-violet-700">
            {option.price === 0 ? "Free" : money(option.price)}
          </span>

          {selected && <CheckCircle2 size={19} className="text-violet-600" />}
        </div>
      </div>
    </button>
  );
}