"use client";

import Image from "next/image";
import Link from "next/link";
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
    <div className="bg-white rounded-2xl p-8 border border-[#EDEBF5]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Marketplace Picks</h3>
        <Link
          href="/marketplace/products"
          className="text-violet-600 text-sm font-medium hover:underline"
        >
          Browse all →
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
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
        <p className="text-gray-400 text-sm text-center py-6">
          No products available yet.
        </p>
      )}

      <div className="space-y-6">
        {products?.map((product) => {
          const primaryImage =
            product.images.find((image) => image.isPrimary)?.url ??
            product.images[0]?.url;

          return (
            <Link
              key={product.id}
              href={`/marketplace/product/${product.id}`}
              className="flex gap-4 items-center group cursor-pointer"
            >
              <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-gray-100 rounded-2xl">
                {primaryImage && (
                  <Image
                    src={primaryImage}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.title}</p>
                <p className="text-violet-600 font-semibold">{money(product.price)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
