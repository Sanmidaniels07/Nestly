"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Store, Video } from "lucide-react";

import { useLives } from "@/src/hooks/use-lives";
import { Live } from "@/src/types/live";
import { LiveBadge, liveWhen } from "./live-ui";

// "Live now" + "Coming up" cards - on the marketplace home and store pages.
// Renders nothing when there are no lives.

export default function LiveStrip({ store, title = "Live shopping" }: { store?: string; title?: string }) {
  const { data } = useLives(store);
  const lives = [...(data?.live ?? []), ...(data?.upcoming ?? [])];
  if (lives.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] text-ink">{title}</h2>
          <p className="text-[12.5px] text-muted">Watch sellers live, ask questions and grab live-only prices.</p>
        </div>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
        {lives.map((live) => (
          <LiveCard key={live.id} live={live} />
        ))}
      </div>
    </section>
  );
}

function LiveCard({ live }: { live: Live }) {
  const isLive = live.status === "LIVE";
  const deal = Math.max(0, ...live.products.map((product) => product.discountPercent ?? 0));
  const cover = live.coverImage ?? live.products.find((product) => product.image)?.image ?? null;

  return (
    <Link
      href={`/live/${live.code}`}
      className={`group relative block w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border bg-surface sm:w-[250px] ${isLive ? "border-rose-400" : "border-line"}`}
    >
      <div className="relative aspect-[4/5] bg-gradient-to-br from-violet-600 to-indigo-700">
        {cover && <Image src={cover} alt="" fill sizes="250px" className="object-cover transition-transform duration-300 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
        <span className="absolute left-2.5 top-2.5">
          {isLive ? (
            <LiveBadge viewers={live.viewers} />
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
              <CalendarClock size={12} /> {liveWhen(live.scheduledAt)}
            </span>
          )}
        </span>
        {deal > 0 && <span className="absolute right-2.5 top-2.5 rounded-md bg-rose-600 px-1.5 py-0.5 text-[11px] font-bold text-white">Up to {deal}% off</span>}
        {!cover && <Video size={34} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70" />}
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <p className="line-clamp-2 text-[14px] font-semibold leading-snug">{live.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/80">
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20">
              {live.store.logo ? <Image src={live.store.logo} alt="" fill sizes="20px" className="object-cover" /> : <Store size={11} />}
            </span>
            <span className="truncate">{live.store.name}</span>
          </p>
        </div>
      </div>
      <div className="p-2.5 text-center text-[12.5px] font-semibold text-violet-700 dark:text-violet-300">{isLive ? "Watch now" : `${live.interestedCount} waiting · Remind me`}</div>
    </Link>
  );
}
