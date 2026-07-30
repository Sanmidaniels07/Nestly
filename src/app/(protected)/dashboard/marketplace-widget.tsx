"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { useFeaturedProducts } from "@/src/hooks/use-featured-products";
import Skeleton from "@/src/components/ui/skeleton";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MarketplacePicks() {
  const { data: products, isLoading } = useFeaturedProducts(2);

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
            <Store size={16} className="text-violet-600" />
          </div>
          <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
            Marketplace picks
          </h3>
        </div>
        <Link
          href="/marketplace/products"
          className="group flex shrink-0 items-center gap-1 text-[12.5px] font-semibold text-violet-600 hover:underline"
        >
          Browse
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {isLoading && (
        <div className="mt-6 space-y-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && products?.length === 0 && (
        <p className="py-8 text-center text-[13px] text-[#94A3B8]">
          No products available yet.
        </p>
      )}

      {!isLoading && !!products?.length && (
        <div className="mt-6 space-y-5">
          {products.map((product) => {
            const primaryImage =
              product.images.find((image) => image.isPrimary)?.url ??
              product.images[0]?.url;

            return (
              <Link
                key={product.id}
                href={`/marketplace/product/${product.id}`}
                className="group flex items-center gap-3.5"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F8F8FC]">
                  {primaryImage && (
                    <Image
                      src={primaryImage}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                    {product.title}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">
                    {money(product.price)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
