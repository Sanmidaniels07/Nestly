"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Package, Star, TrendingUp, Users } from "lucide-react";

import { Store as StoreType } from "@/src/types/store";
import UserAvatar from "@/src/components/ui/user-avatar";
import { getCategoryTone } from "@/src/lib/category-style";

interface Props {
  seller: StoreType;
  /** Position in a trending list (1-based) - shows a rank badge. */
  rank?: number;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

export default function SellerCard({ seller, rank }: Props) {
  const location = [seller.city, seller.state].filter(Boolean).join(", ");
  const tone = getCategoryTone({ slug: seller.slug });
  const previews = seller.previewProducts ?? [];
  const hasRating = !!seller.rating && seller.rating > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_22px_48px_-26px_rgba(76,29,149,0.45)] dark:hover:border-violet-500/30">
      {/* Banner */}
      <div className={`relative h-28 w-full overflow-hidden ${seller.banner ? "bg-surface-sunken" : tone.tile}`}>
        {seller.banner ? (
          <Image src={seller.banner} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.7)_1.2px,transparent_1.2px)] [background-size:16px_16px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

        {rank !== undefined && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11.5px] font-bold text-violet-700 shadow-sm backdrop-blur">
            <TrendingUp size={13} />#{rank} Trending
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        {/* Identity */}
        <div className="-mt-8 flex items-end gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] ring-4 ring-surface">
            {seller.logo ? (
              <Image src={seller.logo} alt={seller.name} fill className="object-cover" />
            ) : (
              <UserAvatar name={seller.name} size={64} />
            )}
          </div>
        </div>

        <div className="mt-3 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[16.5px] font-semibold text-ink">{seller.name}</h3>
            {seller.isVerified && <BadgeCheck size={16} className="shrink-0 text-sky-500" aria-label="Verified store" />}
          </div>
          {location && (
            <p className="mt-1 flex items-center gap-1 text-[12.5px] text-muted">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 font-medium text-ink-2">
            <Package size={13} className="text-violet-600 dark:text-violet-400" />
            {(seller.productCount ?? 0).toLocaleString()} {seller.productCount === 1 ? "product" : "products"}
          </span>
          {seller.followersCount !== undefined && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 font-medium text-ink-2">
              <Users size={13} className="text-violet-600 dark:text-violet-400" />
              {seller.followersCount.toLocaleString()} {seller.followersCount === 1 ? "follower" : "followers"}
            </span>
          )}
          {hasRating && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {seller.rating!.toFixed(1)}
              {!!seller.reviewCount && <span className="font-normal opacity-70">({seller.reviewCount})</span>}
            </span>
          )}
        </div>

        {/* What they sell */}
        {previews.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {previews.map((product) => (
              <Link
                key={product.id}
                href={`/marketplace/product/${product.id}`}
                title={product.title}
                className="relative aspect-square overflow-hidden rounded-xl bg-surface-sunken"
              >
                {product.image ? (
                  <Image src={product.image} alt={product.title} fill sizes="120px" className="object-cover transition-transform duration-500 hover:scale-110" />
                ) : (
                  <div className={`h-full w-full ${tone.card}`} />
                )}
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10.5px] font-semibold text-white backdrop-blur">
                  {money(product.price)}
                </span>
              </Link>
            ))}
            {Array.from({ length: 3 - previews.length }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-line bg-surface-sunken" />
            ))}
          </div>
        ) : (
          seller.description && (
            <p className="mt-4 line-clamp-2 text-[13px] leading-6 text-muted">{seller.description}</p>
          )
        )}

        {/* Pinned to the bottom so buttons line up across cards of different heights. */}
        <div className="mt-auto pt-5">
          <Link
            href={`/marketplace/seller/${seller.slug}`}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
          >
            Visit store
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
