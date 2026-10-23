"use client";

import { Plus, ListChecks } from "lucide-react";
import Button from "@/src/components/ui/button";

import { ProductDraft } from "@/src/types/products-draft";
import SpecificationRow from "./specification-row";
import EditProfileTags from "@/src/app/(protected)/profile/components/edit-profile-tags";
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
    // Specs are optional for a listing, so no hard validation blocks
    // progress — just silently drop any fully-empty rows before moving on.
    setDraft((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((s) => s.key.trim() || s.value.trim()),
    }));
    onNext();
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Specifications
      </h2>
      <p className="mt-1 text-[13px] text-muted">
        Add technical details buyers care about — optional, but builds trust.
      </p>

      <div className="mt-6 space-y-3">
        {draft.specifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong py-10 text-center">
            <ListChecks size={26} className="text-faint" strokeWidth={1.5} />
            <p className="mt-3 text-[13.5px] font-medium text-ink">No specifications added</p>
            <p className="mt-1 text-[12.5px] text-subtle">
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
        className="mt-4 flex items-center gap-2 rounded-xl border border-violet-200 dark:border-violet-500/30 px-4 py-2.5 text-[13.5px] font-medium text-violet-700 dark:text-violet-300 transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/10"
      >
        <Plus size={15} />
        Add specification
      </button>

      <div className="mt-8 border-t border-line-soft pt-6">
        <EditProfileTags
          title="Highlights"
          description="Key selling points buyers see at a glance."
          values={draft.highlights}
          onChange={(highlights) => setDraft((prev) => ({ ...prev, highlights }))}
          placeholder="e.g. Free returns, press Enter"
          maxTags={10}
        />
      </div>


      <div className="mt-8 flex justify-between border-t border-line-soft pt-6">
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