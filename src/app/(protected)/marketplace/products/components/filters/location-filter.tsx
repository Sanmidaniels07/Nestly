"use client";

import { LocateFixed, Search } from "lucide-react";
import Input from "@/src/components/ui/input";

interface Props {
  address: string;
  onAddressChange: (value: string) => void;
  onUseCurrentLocation: () => void;
}

export default function LocationFilter({ address, onAddressChange, onUseCurrentLocation }: Props) {
  return (
    <div className="space-y-3">
      <button
        onClick={onUseCurrentLocation}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-[13.5px] font-semibold text-violet-700 transition-colors hover:bg-violet-100"
      >
        <LocateFixed size={16} />
        Use current location
      </button>

      <Input
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Search another address..."
        icon={<Search size={16} />}
      />
    </div>
  );
}