"use client";

import Input from "@/src/components/ui/input";
import FormSelect from "@/src/components/ui/form-select";
import { ProductStatus } from "@/src/types/product";
import { ProductEditDraft } from "../types";

interface Props {
  draft: ProductEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductEditDraft>>;
}

export default function EditPricingSection({ draft, setDraft }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Pricing &amp; inventory
      </h2>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Control what buyers pay and how many are in stock.
      </p>

      <div className="mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Price (₦)"
            type="number"
            value={draft.price}
            onChange={(e) => setDraft((prev) => ({ ...prev, price: e.target.value }))}
          />

          <Input
            label="Original price (₦)"
            type="number"
            value={draft.originalPrice}
            onChange={(e) => setDraft((prev) => ({ ...prev, originalPrice: e.target.value }))}
            placeholder="Optional — shows a strikethrough discount"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Stock quantity"
            type="number"
            value={draft.stock}
            onChange={(e) => setDraft((prev) => ({ ...prev, stock: e.target.value }))}
          />

          <FormSelect
            label="Status"
            value={draft.status}
            onChange={(value) => setDraft((prev) => ({ ...prev, status: value as ProductStatus }))}
            options={[
              { label: "Published", value: "PUBLISHED" },
              { label: "Draft", value: "DRAFT" },
              { label: "Out of stock", value: "OUT_OF_STOCK" },
              { label: "Archived", value: "ARCHIVED" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
