"use client";

import Input from "@/src/components/ui/input";
import FormSelect from "@/src/components/ui/form-select";
import { ProductStatus } from "@/src/types/product";
import { ProductEditDraft } from "../types";
import EarningsPreview from "../../../components/earnings-preview";
import OptionsEditor from "../../../components/options-editor";
import { LegacyProductVariant } from "@/src/types/product";

interface Props {
  draft: ProductEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductEditDraft>>;
  optionsError?: string | null;
  legacyVariants?: LegacyProductVariant[];
}

export default function EditPricingSection({ draft, setDraft, optionsError, legacyVariants }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Pricing &amp; inventory
      </h2>
      <p className="mt-1 text-[13px] text-muted">
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

        <EarningsPreview price={draft.price} categoryId={draft.categoryId} />

        <div className="grid gap-4 md:grid-cols-2">
          {draft.optionsDraft.enabled ? (
            <div>
              <p className="mb-2 block text-sm font-medium text-ink-2">Stock quantity</p>
              <p className="flex h-14 items-center rounded-3xl border border-dashed border-line px-5 text-[13px] text-muted">
                Set per option below
              </p>
            </div>
          ) : (
            <Input
              label="Stock quantity"
              type="number"
              value={draft.stock}
              onChange={(e) => setDraft((prev) => ({ ...prev, stock: e.target.value }))}
            />
          )}

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

        <div className="border-t border-line-soft pt-6">
          <OptionsEditor
            value={draft.optionsDraft}
            onChange={(optionsDraft) => setDraft((prev) => ({ ...prev, optionsDraft }))}
            basePrice={draft.price}
            error={draft.optionsDraft.enabled ? optionsError : null}
            legacy={legacyVariants}
          />
        </div>
      </div>
    </section>
  );
}
