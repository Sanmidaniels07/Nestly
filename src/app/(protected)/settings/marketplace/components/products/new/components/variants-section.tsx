"use client";

import { Plus } from "lucide-react";
import { EditableVariant } from "@/src/types/product";
import VariantRow from "./variant-row";

interface Props {
  variants: EditableVariant[];
  onChange: (variants: EditableVariant[]) => void;
}

export default function VariantsSection({ variants, onChange }: Props) {
  const addVariant = () => {
    onChange([
      ...variants,
      { id: crypto.randomUUID(), name: "", value: "", price: "", stock: "" },
    ]);
  };

  const updateVariant = (
    id: string,
    field: "name" | "value" | "price" | "stock",
    value: string
  ) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
          Variants
        </h3>
        <p className="mt-1 text-[13.5px] text-[#64748B]">
          Add options like size or color. Leave price and stock blank to use this
          product&apos;s base values.
        </p>
      </div>

      {variants.length > 0 && (
        <div className="space-y-3">
          {variants.map((variant) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              onChange={updateVariant}
              onDelete={removeVariant}
            />
          ))}
        </div>
      )}

      <button
        onClick={addVariant}
        className="flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-[13.5px] font-medium text-violet-700 transition-colors hover:bg-violet-50"
      >
        <Plus size={15} />
        Add variant
      </button>
    </div>
  );
}
