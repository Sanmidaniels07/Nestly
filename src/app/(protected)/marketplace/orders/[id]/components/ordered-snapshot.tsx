"use client";

import { useState } from "react";
import { ChevronDown, FileText, Info } from "lucide-react";

import { OrderItem } from "@/src/types/order";
import { formatConditionLabel } from "@/src/lib/utils";

// The listing exactly as it was when the buyer ordered - the record used
// for returns and "not as described" problems, whatever the seller edits later.
export default function OrderedSnapshot({ item }: { item: OrderItem }) {
  const [open, setOpen] = useState(false);
  if (!item.productTitle) return null;

  const specs = item.productSpecs ?? [];
  const highlights = item.productHighlights ?? [];
  const facts = [
    item.productCondition && { label: "Condition", value: formatConditionLabel(item.productCondition) },
    item.productBrand && { label: "Brand", value: item.productBrand },
    item.productSku && { label: "SKU", value: item.productSku },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="rounded-xl border border-line bg-surface-sunken">
      {item.listingChanged && (
        <p className="flex items-start gap-2 border-b border-line px-3.5 py-2.5 text-[12.5px] leading-snug text-ink-2">
          <Info size={14} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
          <span>
            The seller has updated this listing since you ordered. Your order is for the version below.
          </span>
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left text-[13px] font-semibold text-ink"
      >
        <span className="flex items-center gap-2">
          <FileText size={14} className="text-violet-600 dark:text-violet-400" />
          What you ordered
        </span>
        <ChevronDown size={16} className={`shrink-0 text-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-line px-3.5 pb-4 pt-3.5 text-[13px] text-ink-2">
          <p className="font-semibold text-ink [overflow-wrap:anywhere]">{item.productTitle}</p>

          {facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0">
                  <dt className="text-[11px] text-subtle">{fact.label}</dt>
                  <dd className="mt-0.5 font-medium text-ink [overflow-wrap:anywhere]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {highlights.length > 0 && (
            <ul className="list-disc space-y-1 pl-5">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}

          {specs.length > 0 && (
            <dl className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
              {specs.map((spec) => (
                <div key={`${spec.name}-${spec.value}`} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 px-3 py-2">
                  <dt className="text-subtle [overflow-wrap:anywhere]">{spec.name}</dt>
                  <dd className="font-medium text-ink [overflow-wrap:anywhere]">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {item.productDescription && (
            <p className="whitespace-pre-line leading-relaxed [overflow-wrap:anywhere]">{item.productDescription}</p>
          )}
        </div>
      )}
    </div>
  );
}
