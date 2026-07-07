"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function ProductDescription({ product }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-8 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
          Description
        </h2>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[13px] font-semibold text-violet-600 hover:underline"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp size={15} />
            </>
          ) : (
            <>
              Read more
              <ChevronDown size={15} />
            </>
          )}
        </button>
      </div>

      <p
        className={`mt-4 text-[14.5px] leading-relaxed text-[#475569] transition-all ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {product.description}
      </p>
    </section>
  );
}