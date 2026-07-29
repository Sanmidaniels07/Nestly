"use client";

import { Trash2 } from "lucide-react";
import Input from "@/src/components/ui/input";
import { EditableVariant } from "@/src/types/product";

interface Props {
  variant: EditableVariant;
  onChange: (id: string, field: "name" | "value" | "price" | "stock", value: string) => void;
  onDelete: (id: string) => void;
}

export default function VariantRow({ variant, onChange, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Option"
          value={variant.name}
          placeholder="e.g. Size"
          onChange={(e) => onChange(variant.id, "name", e.target.value)}
        />
        <Input
          label="Value"
          value={variant.value}
          placeholder="e.g. Large"
          onChange={(e) => onChange(variant.id, "value", e.target.value)}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Input
          label="Price override (optional)"
          type="number"
          value={variant.price}
          placeholder="Same as base price"
          onChange={(e) => onChange(variant.id, "price", e.target.value)}
        />
        <Input
          label="Stock (optional)"
          type="number"
          value={variant.stock}
          placeholder="Same as base stock"
          onChange={(e) => onChange(variant.id, "stock", e.target.value)}
        />

        <button
          onClick={() => onDelete(variant.id)}
          aria-label="Remove variant"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border border-red-100 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
