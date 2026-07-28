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
          ? "border-violet-600 bg-violet-50"
          : "border-[#ECE9F6] bg-white hover:border-violet-300"
      }`}
    >
      <div className="flex justify-between gap-4">
        <button onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-violet-600" />
            <span className="text-[14px] font-semibold text-[#13131A]">
              {address.fullName}
            </span>
            {address.isDefault && (
              <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10.5px] font-medium text-white">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-[13px] text-[#64748B]">{address.phone}</p>

          <p className="mt-2 text-[13px] leading-6 text-[#475569]">
            {address.address}
            <br />
            {address.city}, {address.state}
            <br />
            {address.country}
          </p>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-3">
          {selected && <CheckCircle2 size={20} className="text-violet-600" />}
          <button
            onClick={onDelete}
            aria-label="Delete address"
            className="text-[#94A3B8] transition-colors hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
