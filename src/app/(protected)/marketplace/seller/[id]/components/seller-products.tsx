"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/src/types/product";

interface Props {
  products: Product[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SellerProducts({ products }: Props) {
  return (
    <section className="space-y-6">
      <div className="border-b border-dashed border-[#ECE9F6] pb-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
          Store products
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          Products
        </h2>
        <p className="mt-1.5 text-[13px] text-[#64748B]">
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => {
            const primaryImage =
              product.images.find((image) => image.isPrimary)?.url ??
              product.images[0]?.url;

            return (
              <Link
                key={product.id}
                href={`/marketplace/product/${product.id}`}
                className="overflow-hidden rounded-2xl border border-[#EDEBF5] bg-white transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
              >
                <div className="relative aspect-square bg-[#F8F8FC]">
                  {primaryImage && (
                    <Image
                      src={primaryImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="space-y-1.5 p-4">
                  <h3 className="line-clamp-1 text-[14px] font-medium text-[#13131A]">
                    {product.title}
                  </h3>
                  <p className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-violet-700">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] py-16 text-center">
          <p className="text-[13.5px] text-[#94A3B8]">This store has no products yet.</p>
        </div>
      )}
    </section>
  );
}
