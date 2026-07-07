"use client";

import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function ProductSpecifications({ product }: Props) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
      <div className="border-b border-[#ECE9F6] px-6 py-5">
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
          Specifications
        </h2>
      </div>

      <div className="divide-y divide-[#F2F1F8]">
        {product.specifications.map((spec, index) => (
          <div
            key={spec.label}
            className={`grid gap-2 px-6 py-3.5 md:grid-cols-[200px_1fr] ${
              index % 2 === 0 ? "bg-[#FBFAFE]" : "bg-white"
            }`}
          >
            <p className="text-[13.5px] font-medium text-[#64748B]">{spec.label}</p>
            <p className="text-[13.5px] text-[#13131A]">{spec.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}