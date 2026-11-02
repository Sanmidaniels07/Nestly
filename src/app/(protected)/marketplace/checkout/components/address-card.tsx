"use client";

import { Address } from "@/src/types/address";
import { CheckCircle2, MapPin, Trash2 } from "lucide-react";

interface Props {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function AddressCard({ address, selected, onSelect, onDelete }: Props) {
  return (
    <div
      className={`w-full rounded-2xl border p-5 text-left transition-colors ${
        selected
          ? "border-violet-600 bg-violet-50 dark:bg-violet-500/10"
          : "border-line bg-surface hover:border-violet-300 dark:hover:border-violet-500/40"
      }`}
    >
      <div className="flex justify-between gap-4">
        <button onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-violet-600 dark:text-violet-400" />
            <span className="text-[14px] font-semibold text-ink">
              {address.fullName}
            </span>
            {address.isDefault && (
              <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10.5px] font-medium text-white">
                Default
              </span>
            )}
            {address.latitude != null && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                Pinned on map
              </span>
            )}
          </div>

          <p className="mt-2 text-[13px] text-muted">{address.phone}</p>

          <p className="mt-2 text-[13px] leading-6 text-ink-3">
            {address.address}
            <br />
            {address.city}, {address.state}
            <br />
            {address.country}
          </p>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-3">
          {selected && <CheckCircle2 size={20} className="text-violet-600 dark:text-violet-400" />}
          <button
            onClick={onDelete}
            aria-label="Delete address"
            className="text-subtle transition-colors hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
