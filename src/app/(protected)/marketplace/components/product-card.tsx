"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, BadgeCheck, Star, Truck, Zap } from "lucide-react";

import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
  compact?: boolean;
  flashDeal?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({
  product,
  compact = false,
  flashDeal = false,
}: Props) {
  const [saved, setSaved] = useState(false);

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
        <Image
          fill
          src={product.images[0]}
          alt={product.name}
          className="object-cover transition-transform duration-500 hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {flashDeal && (
            <span className="flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white">
              <Zap size={11} fill="white" />
              Flash deal
            </span>
          )}

          <span
            className={`
              w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold
              ${product.condition === "New" ? "bg-emerald-500 text-white" : "bg-amber-400 text-[#13131A]"}
            `}
          >
            {product.condition}
          </span>
        </div>

        <button
          onClick={() => setSaved(!saved)}
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
        <div className="flex items-center gap-1.5">
          {product.seller.verified && (
            <BadgeCheck size={14} className="text-blue-500" />
          )}{" "}
          <span className="truncate text-[12px] text-[#64748B]">
            {product.seller.name}
          </span>
        </div>

        <h3
          className={`
            font-[family-name:var(--font-fraunces)] italic leading-tight text-[#13131A]
            ${compact ? "text-[17px]" : "text-[21px]"}
          `}
        >
          {product.name}
        </h3>

        <p
          className={`font-[family-name:var(--font-mono)] font-semibold text-violet-700 ${
            compact ? "text-[17px]" : "text-[21px]"
          }`}
        >
          {formatPrice(product.price)}
        </p>

        {!compact && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium">
                  {product.rating}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                  ({product.reviews})
                </span>
              </div>

              <div className="flex items-center gap-1 text-[#64748B]">
                <MapPin size={14} />
                <span className="font-[family-name:var(--font-mono)] text-[12.5px]">
                  {product.seller.distance}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
              <Truck size={14} className="text-violet-600" />
              {product.delivery ? "Delivery available" : "Pickup only"}
            </div>
          </>
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
