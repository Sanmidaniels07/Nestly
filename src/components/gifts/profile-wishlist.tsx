"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, Heart, Lock, Settings2 } from "lucide-react";

import { useUserWishlist } from "@/src/hooks/use-wishlist";
import Skeleton from "@/src/components/ui/skeleton";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

/**
 * A person's wishlist on their profile - gift ideas. Each item can be sent
 * to them as a gift (they add their own address when they accept it).
 */
export default function ProfileWishlist({
  userId,
  name,
  isSelf,
}: {
  userId: string;
  name: string;
  isSelf: boolean;
}) {
  const { data, isLoading, isError } = useUserWishlist(userId, true);
  const items = data?.items ?? [];
  const first = firstName(name);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 px-8 py-14 text-center">
        <Lock className="mx-auto h-7 w-7 text-faint" strokeWidth={1.5} />
        <p className="mt-3 text-[14.5px] font-medium text-ink">This wishlist isn&apos;t shared with you</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 dark:border-violet-500/25 dark:bg-violet-500/10">
        <p className="flex items-center gap-2 text-[13px] text-ink-2">
          <Gift size={16} className="shrink-0 text-violet-600 dark:text-violet-300" />
          {isSelf
            ? "Your wishlist - people you share it with can send you any of these as a gift."
            : `Send ${first} something from their wishlist. They add their own delivery address - you don't need it.`}
        </p>
        {isSelf && (
          <Link
            href="/marketplace/saved"
            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300"
          >
            <Settings2 size={14} /> Who can see it
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 px-8 py-14 text-center">
          <Heart className="mx-auto h-7 w-7 text-faint" strokeWidth={1.5} />
          <p className="mt-3 text-[14.5px] font-medium text-ink">
            {isSelf ? "Your wishlist is empty" : `${first} hasn't saved anything yet`}
          </p>
          {isSelf && (
            <p className="mt-1 text-[12.5px] text-muted">Tap the heart on any product to add it.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map(({ product }) => {
            const image = product.images?.[0]?.url;
            const soldOut = product.status === "OUT_OF_STOCK";
            return (
              <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                <Link href={`/marketplace/product/${product.id}`} className="relative block aspect-square bg-surface-sunken">
                  {image && (
                    <Image
                      src={image}
                      alt={product.title}
                      fill
                      sizes="(min-width: 640px) 220px, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                  {soldOut && (
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10.5px] font-semibold text-white">
                      Sold out
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-3">
                  <Link href={`/marketplace/product/${product.id}`} className="line-clamp-2 text-[13px] font-medium text-ink hover:underline">
                    {product.title}
                  </Link>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700 dark:text-violet-300">
                    {naira(product.price)}
                  </p>
                  {product.store?.name && <p className="mt-0.5 truncate text-[11.5px] text-subtle">{product.store.name}</p>}
                  {!isSelf && !soldOut && (
                    <Link
                      href={`/marketplace/send-gift?product=${product.id}&to=${userId}`}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-[12.5px] font-semibold text-white transition hover:brightness-110"
                    >
                      <Gift size={14} /> Send as a gift
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
