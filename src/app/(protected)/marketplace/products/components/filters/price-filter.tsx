"use client";

import Input from "@/src/components/ui/input";

interface Props {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export default function PriceFilter({ min, max, onMinChange, onMaxChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Input
        label="Minimum"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        placeholder="₦0"
        inputMode="numeric"
      />

      <Input
        label="Maximum"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        placeholder="₦5,000,000"
        inputMode="numeric"
      />
    </div>
  );
}