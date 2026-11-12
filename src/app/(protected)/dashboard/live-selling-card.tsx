"use client";

import Link from "next/link";
import { CalendarClock, Eye, Radio, Video } from "lucide-react";

import { useMyLives } from "@/src/hooks/use-lives";
import { liveWhen } from "@/src/components/live/live-ui";

// Live selling on the seller's dashboard: their live right now, the next one
// coming up, or - if they've never tried it - an invitation to go live.

export const LIVES_TAB = "/settings/marketplace?tab=lives";

export default function LiveSellingCard() {
  const { data, isLoading } = useMyLives();
  if (isLoading || !data) return null;

  const live = data.lives.find((item) => item.status === "LIVE");
  const next = data.lives
    .filter((item) => item.status === "SCHEDULED")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  if (live) {
    return (
      <section className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-rose-600 to-fuchsia-600 p-5 text-white shadow-lg shadow-rose-500/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Radio size={22} className="animate-pulse" />
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold">You&apos;re live now</p>
            <p className="truncate text-[13px] text-white/80">
              {live.title} · <Eye size={13} className="inline" /> {live.viewers} watching
            </p>
          </div>
        </div>
        <Link href={`/marketplace/live/${live.id}`} className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-[13.5px] font-semibold text-rose-600">
          Back to your live
        </Link>
      </section>
    );
  }

  if (next) {
    return (
      <section className="flex flex-col gap-4 rounded-3xl border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-500/30 dark:bg-violet-500/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <CalendarClock size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">Your next live</p>
            <p className="truncate text-[15.5px] font-semibold text-ink">{next.title}</p>
            <p className="text-[13px] text-muted">
              {liveWhen(next.scheduledAt)} · {next.interestedCount} waiting
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href={`/marketplace/live/${next.id}`} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-[13.5px] font-semibold text-white sm:flex-none">
            <Video size={16} /> Open studio
          </Link>
          <Link href={LIVES_TAB} className="flex h-11 flex-1 items-center justify-center rounded-xl border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink-2 sm:flex-none">
            All lives
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A1B4D] via-violet-800 to-rose-700 p-5 text-white sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-500/30 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> New · Live selling
          </p>
          <p className="mt-2.5 text-[18px] font-semibold leading-snug sm:text-[20px]">Sell live, like a pop-up shop</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-white/80">
            Show your products on camera, answer questions in the chat and let people buy right there at live-only prices. Share the link with anyone, even if they&apos;re not on Nestly yet.
          </p>
        </div>
        <div className="flex shrink-0 gap-2 sm:flex-col">
          <Link href={`${LIVES_TAB}&new=now`} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 text-[13.5px] font-semibold hover:bg-rose-600">
            <Radio size={16} /> Go live now
          </Link>
          <Link href={`${LIVES_TAB}&new=schedule`} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13.5px] font-semibold text-violet-700">
            <CalendarClock size={16} /> Schedule
          </Link>
        </div>
      </div>
    </section>
  );
}
