"use client";

import { Product } from "@/src/types/product";

interface Props {
  product: Product;
}

export default function ProductSpecifications({ product }: Props) {
  if (product.specifications.length === 0) return null;

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
            key={spec.id ?? spec.name}
            className={`grid gap-2 px-6 py-3.5 md:grid-cols-[200px_1fr] ${
              index % 2 === 0 ? "bg-[#FBFAFE]" : "bg-white"
            }`}
          >
            <p className="text-[13.5px] font-medium text-[#64748B]">{spec.name}</p>
            <p className="text-[13.5px] text-[#13131A]">{spec.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
