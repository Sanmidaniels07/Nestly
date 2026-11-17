"use client";

import Image from "next/image";
import Link from "next/link";
import { Cake, Gift, Radio, Users } from "lucide-react";

import UserAvatar from "@/src/components/ui/user-avatar";
import { naira } from "@/src/lib/payment-link";
import { FeedHighlights } from "@/src/types/shopping-feed";

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

// "Happening now": stores live, birthdays this week, group gifts friends
// started - the things worth acting on today, before the stream.
export default function HighlightsRail({ highlights }: { highlights: FeedHighlights }) {
  const count = highlights.live.length + highlights.birthdays.length + highlights.groupGifts.length;
  if (count === 0) return null;

  return (
    <section aria-label="Happening now">
      <div className="mb-2.5 flex items-baseline justify-between px-0.5">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">
          Happening now
        </p>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {highlights.live.map((live) => (
          <Link
            key={live.code}
            href={`/live/${live.code}`}
            className="group relative flex h-[210px] w-[150px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-fuchsia-600 to-violet-700 p-3 text-white shadow-[0_18px_40px_-22px_rgba(190,24,93,0.8)]"
          >
            {live.coverImage && (
              <Image src={live.coverImage} alt="" fill sizes="150px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[10.5px] font-bold tracking-wide">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              LIVE
            </span>
            <span className="relative flex items-center gap-1.5">
              <UserAvatar name={live.store.name} src={live.store.logo} size={22} className="ring-2 ring-white/70" />
              <span className="truncate text-[11.5px] font-semibold">{live.store.name}</span>
            </span>
            <span className="relative mt-1 line-clamp-2 text-[13px] font-semibold leading-snug">{live.title}</span>
            <span className="relative mt-1.5 inline-flex items-center gap-1 text-[11px] text-white/80">
              <Radio size={11} /> Tap to watch
            </span>
          </Link>
        ))}

        {highlights.birthdays.map((person) => (
          <Link
            key={person.id}
            href={`/users/${person.username ?? person.id}?tab=wishlist`}
            className="relative flex h-[210px] w-[150px] shrink-0 snap-start flex-col items-center justify-between overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-b from-amber-50 via-rose-50 to-fuchsia-50 p-3 text-center dark:border-amber-400/20 dark:from-amber-400/10 dark:via-rose-400/10 dark:to-fuchsia-500/10"
          >
            {/* Confetti */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_15%_20%,#f59e0b_0_2px,transparent_3px),radial-gradient(circle_at_80%_15%,#ec4899_0_2px,transparent_3px),radial-gradient(circle_at_70%_45%,#8b5cf6_0_1.5px,transparent_2.5px),radial-gradient(circle_at_25%_60%,#10b981_0_1.5px,transparent_2.5px),radial-gradient(circle_at_88%_70%,#f43f5e_0_2px,transparent_3px)]"
            />
            <span className="relative mt-2 rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-violet-600 p-[3px]">
              <UserAvatar name={person.name} src={person.avatar} size={64} className="ring-2 ring-surface" />
            </span>
            <span className="relative">
              <span className="block truncate text-[13.5px] font-semibold text-ink">{firstName(person.name)}</span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-rose-600 dark:text-rose-300">
                <Cake size={12} /> {person.inDays === 0 ? "Birthday today" : person.inDays === 1 ? "Tomorrow" : `In ${person.inDays} days`}
              </span>
            </span>
            <span className="relative inline-flex w-full items-center justify-center gap-1 rounded-xl bg-surface/90 py-1.5 text-[11.5px] font-semibold text-violet-700 shadow-sm dark:text-violet-300">
              <Gift size={12} /> Send a gift
            </span>
          </Link>
        ))}

        {highlights.groupGifts.map((gift) => {
          const percent = Math.min(100, Math.round((gift.raised / gift.target) * 100));
          return (
            <Link
              key={gift.code}
              href={`/chip-in/${gift.code}`}
              className="relative flex h-[210px] w-[150px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-violet-200 bg-surface dark:border-violet-500/30"
            >
              <span className="relative h-[92px] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-amber-50 dark:from-violet-500/20 dark:via-fuchsia-500/10 dark:to-amber-500/5">
                {gift.product.image ? (
                  <Image src={gift.product.image} alt="" fill sizes="150px" className="object-cover" />
                ) : (
                  <Gift size={26} className="absolute inset-0 m-auto text-violet-600" />
                )}
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-bold text-violet-700">
                  <Users size={11} /> Chip in
                </span>
              </span>
              <span className="flex flex-1 flex-col justify-between p-2.5">
                <span className="line-clamp-2 text-[12.5px] font-semibold leading-snug text-ink">
                  For {firstName(gift.recipientName)} · from {firstName(gift.organizer.name)}
                </span>
                <span>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <span className="block h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400" style={{ width: `${percent}%` }} />
                  </span>
                  <span className="mt-1 block font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
                    {naira(gift.raised)} / {naira(gift.target)}
                  </span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
