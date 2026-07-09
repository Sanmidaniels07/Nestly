"use client";

import { useState } from "react";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { ProductDraft } from "@/src/types/products-draft";

interface Props {
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  onNext: () => void;
}

const DESCRIPTION_MAX = 1000;

export default function BasicInformation({ draft, setDraft, onNext }: Props) {
  const [nameError, setNameError] = useState("");
  const [descError, setDescError] = useState("");

  const descLength = draft.description?.length ?? 0;
  const descNearLimit = descLength > DESCRIPTION_MAX - 100;
  const descAtLimit = descLength >= DESCRIPTION_MAX;

  const handleContinue = () => {
    const name = draft.name?.trim() ?? "";
    const description = draft.description?.trim() ?? "";

    let hasError = false;

    if (!name) {
      setNameError("Product name is required");
      hasError = true;
    } else if (name.length < 3) {
      setNameError("Product name must be at least 3 characters");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!description) {
      setDescError("A description helps buyers understand your product");
      hasError = true;
    } else {
      setDescError("");
    }

    if (hasError) return;
    onNext();
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        Basic information
      </h2>
      <p className="mt-1.5 text-[13.5px] text-[#64748B]">
        Give your product a clear name and description buyers can trust.
      </p>

      <div className="mt-7 space-y-5">
        <Input
          label="Product name"
          value={draft.name}
          placeholder="e.g. MacBook Pro M3 14-inch"
          onChange={(e) => {
            setDraft((prev) => ({ ...prev, name: e.target.value }));
            if (nameError) setNameError("");
          }}
          error={nameError}
        />

        <div>
          <label className="mb-2 block text-[13px] font-medium text-[#334155]">
            Description
          </label>

          <textarea
            value={draft.description}
            placeholder="Describe the product's condition, features, and what makes it worth buying..."
            rows={6}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) => {
              setDraft((prev) => ({ ...prev, description: e.target.value }));
              if (descError) setDescError("");
            }}
            className={`
              w-full resize-none rounded-2xl border bg-[#FAFBFC] px-4 py-3.5 text-[14px] text-[#13131A]
              outline-none transition-colors placeholder:text-[#94A3B8]
              focus:border-violet-400 focus:bg-white
              ${descError ? "border-red-300" : "border-[#E4E6EB]"}
            `}
          />

          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[12px] text-red-500">{descError}</span>
            <span
              className={`font-[family-name:var(--font-mono)] text-[11.5px] ${
                descAtLimit ? "text-red-500" : descNearLimit ? "text-amber-500" : "text-[#94A3B8]"
              }`}
            >
              {descLength}/{DESCRIPTION_MAX}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-[#F2F1F8] pt-6">
        <Button variant="tribely" onClick={handleContinue} className="h-11 rounded-xl px-7">
          Continue
        </Button>
      </div>
    </section>
  );
}