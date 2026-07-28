"use client";

import Input from "@/src/components/ui/input";

interface Props {
  value: string;
  onChange: (brand: string) => void;
}

export default function BrandFilter({ value, onChange }: Props) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. Apple, Samsung..."
    />
  );
}
