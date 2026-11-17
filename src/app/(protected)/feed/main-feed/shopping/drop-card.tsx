"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Sparkles } from "lucide-react";

import UserAvatar from "@/src/components/ui/user-avatar";
import { formatRelativeTime } from "@/src/lib/date";
import { naira } from "@/src/lib/payment-link";
import { DropItem } from "@/src/types/shopping-feed";

// "Just in": a store you follow (or a popular verified one) added new
// items - a swipeable shelf of them.
export default function DropCard({ item }: { item: DropItem }) {
  const storeHref = `/marketplace/seller/${item.store.slug}`;
  const more = item.total - item.products.length;

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_20px_50px_-34px_rgba(76,29,149,0.45)]">
      <header className="flex items-center gap-3 px-4 pb-3 pt-4">
        <Link href={storeHref} className="shrink-0 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-[2px]">
          <UserAvatar name={item.store.name} src={item.store.logo} size={38} className="ring-2 ring-surface" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] text-ink-2">
            <Link href={storeHref} className="font-semibold text-ink hover:underline">
              {item.store.name}
            </Link>
            {item.store.isVerified && <BadgeCheck size={13} className="ml-0.5 inline -translate-y-px text-violet-600" aria-label="Verified business" />}{" "}
            added {item.total === 1 ? "something new" : `${item.total} new items`}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-subtle">
            <span className="inline-flex items-center gap-1 font-semibold text-fuchsia-600 dark:text-fuchsia-300">
              <Sparkles size={12} /> Just in
            </span>
            · {formatRelativeTime(item.at)}
            {item.reason === "POPULAR" && <span className="text-violet-600 dark:text-violet-400">· Popular store</span>}
            {item.reason === "NEAR" && (
              <span className="inline-flex items-center gap-0.5 text-violet-600 dark:text-violet-400">
                · <MapPin size={11} /> Near you
              </span>
            )}
          </p>
        </div>
      </header>

      <div className="flex snap-x gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {item.products.map((product, index) => (
          <Link key={product.id} href={`/marketplace/product/${product.id}`} className="group w-[148px] shrink-0 snap-start">
            <span className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-surface to-amber-50 dark:from-violet-500/10 dark:to-amber-500/5">
              {product.image && (
                <Image src={product.image} alt={product.title} fill sizes="148px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-700">New</span>
              )}
              <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11.5px] font-semibold text-white backdrop-blur-md">
                {naira(product.price)}
              </span>
            </span>
            <span className="mt-1.5 line-clamp-2 text-[12.5px] font-medium leading-snug text-ink-2 group-hover:text-ink">{product.title}</span>
          </Link>
        ))}
        <Link
          href={storeHref}
          className="flex w-[110px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-200 text-center text-[12px] font-semibold text-violet-700 hover:border-violet-400 dark:border-violet-500/30 dark:text-violet-300"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/15">
            <ArrowRight size={16} />
          </span>
          {more > 0 ? `+${more} more` : "Visit store"}
        </Link>
      </div>
    </article>
  );
}
