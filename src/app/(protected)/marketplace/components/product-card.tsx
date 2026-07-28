"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { useToggleWishlist } from "@/src/hooks/use-toggle-wishlist";
import { formatConditionLabel } from "@/src/lib/utils";

import { Product } from "@/src/types/product";

interface Props {
  product: Product;
  compact?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product, compact = false }: Props) {
  const { isSaved: saved, toggle: toggleSaved } = useToggleWishlist(product.id);

  const primaryImage =
    product.images.find((image) => image.isPrimary)?.url ??
    product.images[0]?.url;

  const location = [product.store?.city, product.store?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className="
        overflow-hidden rounded-2xl border border-[#EDEBF5] bg-white
        transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl
      "
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-[#F8F8FC] ${
          compact ? "aspect-square" : "aspect-[4/3]"
        }`}
      >
        {primaryImage && (
          <Image
            fill
            src={primaryImage}
            alt={product.title}
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span
            className={`
              w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold
              ${product.condition === "NEW" ? "bg-emerald-500 text-white" : "bg-amber-400 text-[#13131A]"}
            `}
          >
            {formatConditionLabel(product.condition)}
          </span>
        </div>

        <button
          onClick={toggleSaved}
          aria-label={saved ? "Remove from saved" : "Save item"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-105"
        >
          <Heart
            size={16}
            className={saved ? "fill-red-500 text-red-500" : "text-[#64748B]"}
          />
        </button>
      </div>

      {/* Content */}
      <div className={compact ? "space-y-2.5 p-4" : "space-y-3.5 p-5"}>
        {product.store && (
          <span className="truncate text-[12px] text-[#64748B]">
            {product.store.name}
          </span>
        )}

        <h3
          className={`
            font-[family-name:var(--font-fraunces)] italic leading-tight text-[#13131A]
            ${compact ? "text-[17px]" : "text-[21px]"}
          `}
        >
          {product.title}
        </h3>

        <p
          className={`font-[family-name:var(--font-mono)] font-semibold text-violet-700 ${
            compact ? "text-[17px]" : "text-[21px]"
          }`}
        >
          {formatPrice(product.price)}
        </p>

        {!compact && (
          <div className="flex items-center justify-between">
            {product.rating !== undefined ? (
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium">
                  {product.rating}
                </span>
                {product.reviewCount !== undefined && (
                  <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            ) : (
              <span />
            )}

            {location && (
              <div className="flex items-center gap-1 text-[#64748B]">
                <MapPin size={14} />
                <span className="font-[family-name:var(--font-mono)] text-[12.5px]">
                  {location}
                </span>
              </div>
            )}
          </div>
        )}

        <Link
          href={`/marketplace/product/${product.id}`}
          className="
            block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600
            py-2.5 text-center text-[13.5px] font-semibold text-white
            transition-all hover:brightness-110
          "
        >
          View product
        </Link>
      </div>
    </article>
  );
}
