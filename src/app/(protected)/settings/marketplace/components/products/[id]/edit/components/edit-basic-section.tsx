"use client";

import Input from "@/src/components/ui/input";
import FormSelect from "@/src/components/ui/form-select";
import { useCategories } from "@/src/hooks/use-categories";
import { ProductCondition } from "@/src/types/product";
import { ProductEditDraft } from "../types";

const DESCRIPTION_MAX = 1000;

interface Props {
  draft: ProductEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductEditDraft>>;
}

export default function EditBasicSection({ draft, setDraft }: Props) {
  const { data: categories } = useCategories();
  const descLength = draft.description.length;

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Basic information
      </h2>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Keep this accurate — it&apos;s what buyers see first.
      </p>

      <div className="mt-6 space-y-5">
        <Input
          label="Product name"
          value={draft.title}
          onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormSelect
            label="Category"
            placeholder="Select a category"
            value={draft.categoryId}
            onChange={(value) => setDraft((prev) => ({ ...prev, categoryId: value }))}
            options={(categories ?? []).map((c) => ({ label: c.name, value: c.id }))}
          />

          <FormSelect
            label="Condition"
            value={draft.condition}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, condition: value as ProductCondition }))
            }
            options={[
              { label: "New", value: "NEW" },
              { label: "Used", value: "USED" },
              { label: "Refurbished", value: "REFURBISHED" },
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Brand"
            value={draft.brand}
            onChange={(e) => setDraft((prev) => ({ ...prev, brand: e.target.value }))}
          />

          <Input
            label="SKU"
            value={draft.sku}
            onChange={(e) => setDraft((prev) => ({ ...prev, sku: e.target.value }))}
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium text-[#334155]">
            Description
          </label>

          <textarea
            value={draft.description}
            rows={6}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full resize-none rounded-2xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 py-3.5 text-[14px] text-[#13131A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-violet-400 focus:bg-white"
          />

          <div className="mt-1.5 flex justify-end">
            <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
              {descLength}/{DESCRIPTION_MAX}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
