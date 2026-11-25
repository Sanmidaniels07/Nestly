"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { formatConditionLabel } from "@/src/lib/utils";

export interface ProductDetailsData {
  description?: string | null;
  brand?: string | null;
  condition?: string | null;
  highlights?: string[] | null;
  specifications?: { name: string; value: string }[] | null;
}

// Everything the seller wrote when listing a product - description, brand,
// condition, highlights, specifications - for pages buyers reach from a
// link (pay links, collections), so they don't have to leave to read it.
// Long descriptions fold to a few lines with "Read more".
export default function ProductDetailsBlock({ product, compact = false }: { product: ProductDetailsData; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const description = product.description?.trim() ?? "";
  const highlights = (product.highlights ?? []).filter((h) => h.trim());
  const specs = (product.specifications ?? []).filter((s) => s.name.trim() && s.value.trim());
  const chips = [product.condition && product.condition !== "NEW" ? formatConditionLabel(product.condition) : null, product.brand?.trim() || null].filter(
    Boolean
  ) as string[];
  const long = description.length > (compact ? 140 : 280);
  if (!description && !highlights.length && !specs.length && !chips.length) return null;

  return (
    <div className="space-y-3">
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-ink-2">
              {chip}
            </span>
          ))}
        </div>
      )}

      {description && (
        <div>
          <p className={`whitespace-pre-line text-[13.5px] leading-relaxed text-ink-2 ${long && !open ? (compact ? "line-clamp-3" : "line-clamp-5") : ""}`}>
            {description}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-1 inline-flex items-center gap-1 text-[12.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300"
            >
              {open ? "Show less" : "Read more"}
              <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      )}

      {highlights.length > 0 && (
        <ul className="space-y-1">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-[13px] text-ink-2">
              <Check size={14} className="mt-[3px] shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="min-w-0">{h}</span>
            </li>
          ))}
        </ul>
      )}

      {specs.length > 0 && (
        <dl className="overflow-hidden rounded-xl border border-line">
          {specs.map((s, i) => (
            <div key={`${s.name}-${i}`} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 border-b border-line-soft px-3 py-2 text-[12.5px] last:border-0">
              <dt className="text-muted [overflow-wrap:anywhere]">{s.name}</dt>
              <dd className="font-medium text-ink [overflow-wrap:anywhere]">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
