"use client";

import { useState } from "react";
import { Rocket, FileText, AlertCircle } from "lucide-react";
import { ProductDraft } from "@/src/types/products-draft";
import PreviewCard from "./preview-card";
import CompletionChecklist from "./completion-checklist";
import Button from "@/src/components/ui/button";
import RadioCard from "@/src/components/ui/radio-card";

interface Props {
  draft: ProductDraft;
  onBack: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  onStepClick?: (step: number) => void;
}

export default function ReviewPublish({ draft, onBack, onPublish, onSaveDraft, onStepClick }: Props) {
  const [publishNow, setPublishNow] = useState(true);

  const completed = [
    draft.name.trim() !== "",
    draft.price !== "" && Number(draft.price) > 0,
    draft.specifications.some((s) => s.key.trim()),
    draft.images.length > 0,
    draft.deliveryTime !== "",
  ];

  const isFullyReady = completed[0] && completed[1] && completed[3]; // name, price, images are hard requirements
  const missingCount = completed.filter((c) => !c).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <PreviewCard draft={draft} />

        <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
          <h2 className="text-[16px] font-semibold text-[#13131A]">Publish options</h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Choose whether this listing goes live now or stays hidden until you're ready.
          </p>

          <div className="mt-5 space-y-2.5">
            <RadioCard
              title="Publish immediately"
              description="Live in your store and visible to buyers right away"
              icon={Rocket}
              selected={publishNow}
              onClick={() => setPublishNow(true)}
            />
            <RadioCard
              title="Save as draft"
              description="Keep working on it privately before it goes live"
              icon={FileText}
              selected={!publishNow}
              onClick={() => setPublishNow(false)}
            />
          </div>

          {publishNow && !isFullyReady && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-[12.5px] text-amber-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              Add a name, price, and at least one image before publishing.
            </div>
          )}
        </section>
      </div>

      {/* Sticky sidebar */}
      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <CompletionChecklist completed={completed} onStepClick={onStepClick} />

        <div className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
          <div className="space-y-2.5">
            <Button
              variant="tribely"
              onClick={publishNow ? onPublish : onSaveDraft}
              disabled={publishNow && !isFullyReady}
              className="h-11 w-full rounded-xl"
            >
              {publishNow ? "Publish product" : "Save as draft"}
            </Button>

            {publishNow && (
              <button
                onClick={onSaveDraft}
                className="w-full rounded-xl border border-[#ECE9F6] py-2.5 text-[13px] font-medium text-[#64748B] transition-colors hover:bg-[#F7F7FB]"
              >
                Save as draft instead
              </button>
            )}

            <Button variant="outline" onClick={onBack} className="h-11 w-full rounded-xl">
              Back
            </Button>
          </div>

          {missingCount > 0 && (
            <p className="mt-3 text-center font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
              {missingCount} item{missingCount !== 1 ? "s" : ""} incomplete
            </p>
          )}
        </div>
      </div>
    </div>
  );
}