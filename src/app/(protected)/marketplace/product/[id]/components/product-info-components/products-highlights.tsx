"use client";

import { CheckCircle2 } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function ProductHighlights({ product }: Props) {
  return (
    <div>
      <h3 className="mb-3 font-[family-name:var(--font-fraunces)] text-[18px] italic text-[#13131A]">
        Highlights
      </h3>

      <ul className="space-y-2.5">
        {product.highlights.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-[14px] text-[#334155]">
            <CheckCircle2 size={16} className="shrink-0 text-violet-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}