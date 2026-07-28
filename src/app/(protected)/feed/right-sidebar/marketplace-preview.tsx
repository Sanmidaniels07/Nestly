"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Tag } from "lucide-react";
import { useFeaturedProducts } from "@/src/hooks/use-featured-products";

export default function MarketplacePreview() {
  const router = useRouter();
  const { data: products } = useFeaturedProducts(3);

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 p-6 text-white">
      <div className="flex items-center gap-1.5 text-violet-200">
        <Tag size={14} />
        <span className="text-[12px] font-medium uppercase tracking-wide">
          Marketplace
        </span>
      </div>

      <h3 className="mt-2 text-[19px] font-semibold leading-snug">
        Buy and sell with people you trust
      </h3>

      <div className="mt-5 flex -space-x-3">
        {products?.map((product) => {
          const primaryImage =
            product.images.find((image) => image.isPrimary)?.url ??
            product.images[0]?.url;

          return (
            <div
              key={product.id}
              className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-violet-600 bg-white/95 shadow-lg"
            >
              {primaryImage && (
                <Image src={primaryImage} alt={product.title} fill className="object-cover" />
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => router.push("/marketplace/products")}
        className="
          group mt-6 flex w-full items-center justify-center gap-1.5
          rounded-xl bg-white py-3 text-[14px] font-semibold text-violet-700
          transition-colors hover:bg-violet-50
        "
      >
        Explore marketplace
        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>
    </div>
  );
}
