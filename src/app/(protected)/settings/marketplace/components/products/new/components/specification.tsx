"use client";

import { Plus, ListChecks } from "lucide-react";
import Button from "@/src/components/ui/button";

import { ProductDraft } from "@/src/types/products-draft";
import SpecificationRow from "./specification-row";
interface Props {
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  onBack: () => void;
  onNext: () => void;
}

export default function Specifications({ draft, setDraft, onBack, onNext }: Props) {
  const updateSpecification = (id: string, field: "key" | "value", value: string) => {
    setDraft((prev) => ({
      ...prev,
      specifications: prev.specifications.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSpecification = () => {
    setDraft((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { id: crypto.randomUUID(), key: "", value: "" }],
    }));
  };

  const removeSpecification = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((item) => item.id !== id),
    }));
  };

  const handleContinue = () => {
    // Specs are optional for a listing, so no hard validation blocks progress —
    // just silently drop any fully-empty rows before moving on.
    setDraft((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((s) => s.key.trim() || s.value.trim()),
    }));
    onNext();
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Specifications
      </h2>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Add technical details buyers care about — optional, but builds trust.
      </p>

      <div className="mt-6 space-y-3">
        {draft.specifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E0EE] py-10 text-center">
            <ListChecks size={26} className="text-[#C4C0DC]" strokeWidth={1.5} />
            <p className="mt-3 text-[13.5px] font-medium text-[#13131A]">No specifications added</p>
            <p className="mt-1 text-[12.5px] text-[#94A3B8]">
              Add specs like processor, storage, or dimensions.
            </p>
          </div>
        ) : (
          draft.specifications.map((specification) => (
            <SpecificationRow
              key={specification.id}
              specification={specification}
              onChange={updateSpecification}
              onDelete={removeSpecification}
              canDelete={draft.specifications.length > 0}
            />
          ))
        )}
      </div>

      <button
        onClick={addSpecification}
        className="mt-4 flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-[13.5px] font-medium text-violet-700 transition-colors hover:bg-violet-50"
      >
        <Plus size={15} />
        Add specification
      </button>

      <div className="mt-8 flex justify-between border-t border-[#F2F1F8] pt-6">
        <Button variant="outline" onClick={onBack} className="h-11 rounded-xl px-7">
          Back
        </Button>
        <Button variant="tribely" onClick={handleContinue} className="h-11 rounded-xl px-7">
          Continue
        </Button>
      </div>
    </section>
  );
}