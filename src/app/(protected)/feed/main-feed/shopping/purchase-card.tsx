"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ShieldCheck, ShoppingBag, Sparkles, Star } from "lucide-react";

import UserAvatar from "@/src/components/ui/user-avatar";
import { formatRelativeTime } from "@/src/lib/date";
import { naira } from "@/src/lib/payment-link";
import { PurchaseItem } from "@/src/types/shopping-feed";

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= rating ? "fill-amber-400 text-amber-400" : "fill-white/30 text-white/40"} />
      ))}
    </span>
  );
}

// "Ada bought this" - a real, delivered purchase with the buyer's own
// words and photos. The product is one tap away.
export default function PurchaseCard({ item }: { item: PurchaseItem }) {
  const photos = item.images.length ? item.images : item.product.image ? [item.product.image] : [];
  const ownPhotos = item.images.length > 0;
  const [active, setActive] = useState(0);
  const profile = `/users/${item.buyer.username ?? item.buyer.id}`;
  const productHref = `/marketplace/product/${item.product.id}`;

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_20px_50px_-34px_rgba(76,29,149,0.45)]">
      <header className="flex items-center gap-3 px-4 pb-3 pt-4">
        <Link href={profile} className="shrink-0">
          <UserAvatar name={item.buyer.name} src={item.buyer.avatar} size={40} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] text-ink-2">
            <Link href={profile} className="font-semibold text-ink hover:underline">
              {firstName(item.buyer.name)}
            </Link>{" "}
            bought from{" "}
            <Link href={`/marketplace/seller/${item.product.store.slug}`} className="font-semibold text-ink hover:underline">
              {item.product.store.name}
            </Link>
            {item.product.store.isVerified && <BadgeCheck size={13} className="ml-0.5 inline -translate-y-px text-violet-600" aria-label="Verified business" />}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-subtle">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={12} /> Verified purchase
            </span>
            · {formatRelativeTime(item.at)}
            {item.reason === "POPULAR" && (
              <span className="inline-flex items-center gap-0.5 text-violet-600 dark:text-violet-400">
                · <Sparkles size={11} /> Popular
              </span>
            )}
          </p>
        </div>
      </header>

      {photos.length > 0 && (
        <div className="relative">
          <div
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={(e) => {
              const el = e.currentTarget;
              setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
            }}
          >
            {photos.map((url, index) => (
              <div
                key={url}
                className={`relative w-full shrink-0 snap-center ${ownPhotos ? "aspect-[4/5]" : "aspect-[4/3]"} ${
                  ownPhotos ? "bg-surface-sunken" : "bg-gradient-to-br from-violet-50 via-surface to-amber-50 dark:from-violet-500/10 dark:to-amber-500/5"
                }`}
              >
                <Image
                  src={url}
                  alt={index === 0 ? item.product.title : ""}
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className={ownPhotos ? "object-cover" : "object-contain p-6"}
                />
              </div>
            ))}
          </div>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
            <Stars rating={item.rating} /> {item.rating}.0
          </span>
          {photos.length > 1 && (
            <span className="absolute bottom-4 right-3 flex gap-1">
              {photos.map((url, index) => (
                <span key={url} className={`h-1.5 rounded-full transition-all ${index === active ? "w-4 bg-white" : "w-1.5 bg-white/55"}`} />
              ))}
            </span>
          )}
        </div>
      )}

      <div className="space-y-3.5 p-4">
        {photos.length === 0 && (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
            <Stars rating={item.rating} /> {item.rating}.0
          </span>
        )}
        {item.comment && (
          <p className="font-[family-name:var(--font-fraunces)] text-[17px] italic leading-snug text-ink">&ldquo;{item.comment}&rdquo;</p>
        )}

        <Link
          href={productHref}
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface-sunken p-2.5 pr-3 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
        >
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
            {item.product.image && <Image src={item.product.image} alt="" fill sizes="56px" className="object-cover" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold text-ink">{item.product.title}</span>
            <span className="block font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700 dark:text-violet-300">
              {naira(item.product.price)}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-[12px] font-semibold text-white shadow-md shadow-violet-500/20 transition group-hover:brightness-110">
            <ShoppingBag size={13} /> Shop
          </span>
        </Link>
      </div>
    </article>
  );
}
