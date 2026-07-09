"use client";

import { CheckCircle2, CreditCard } from "lucide-react";
import { SavedCard } from "@/src/mocks/payment";

interface Props {
  card: SavedCard;
  selected: boolean;
  onSelect: () => void;
}

const brandColors: Record<string, string> = {
  Visa: "from-blue-500 to-blue-700",
  Mastercard: "from-orange-500 to-red-600",
  Verve: "from-emerald-500 to-teal-600",
};

export default function SavedCardItem({ card, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full rounded-xl border p-4 text-left transition-colors
        ${selected ? "border-violet-400 bg-violet-50" : "border-[#ECE9F6] hover:border-violet-200"}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${
              brandColors[card.brand] ?? "from-[#64748B] to-[#334155]"
            }`}
          >
            <CreditCard size={16} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[14px] font-semibold text-[#13131A]">{card.brand}</h3>
              <span className="font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
                •••• {card.last4}
              </span>
            </div>
            <p className="mt-0.5 text-[12.5px] text-[#64748B]">{card.holder}</p>
            <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
              Expires {card.expiry}
            </p>
          </div>
        </div>

        {selected && <CheckCircle2 size={19} className="shrink-0 text-violet-600" />}
      </div>

      {card.default && (
        <span className="mt-3 inline-block rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-medium text-violet-700">
          Default card
        </span>
      )}
    </button>
  );
}