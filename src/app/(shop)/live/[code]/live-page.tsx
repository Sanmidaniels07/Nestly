"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Bell,
  BellRing,
  CalendarPlus,
  Clock,
  Loader2,
  Radio,
  Share2,
  Store,
  Video,
} from "lucide-react";

import { useLive, useLiveReminder } from "@/src/hooks/use-lives";
import { useRequireLogin, useSession } from "@/src/hooks/use-session";
import { liveCalendarUrl } from "@/src/services/live.services";
import Skeleton from "@/src/components/ui/skeleton";
import LiveBuySheet from "@/src/components/live/live-buy-sheet";
import {
  LivePrice,
  liveShareUrl,
  liveWhen,
} from "@/src/components/live/live-ui";
import { ApiResponse } from "@/src/types/api";
import { DockedLive } from "@/src/components/live/live-dock";
import { LiveProduct, PublicLive } from "@/src/types/live";

interface Props {
  code: string;
  initialLive?: ApiResponse<PublicLive>;
}

export default function LivePage({ code, initialLive }: Props) {
  const { data: live, isLoading, isError } = useLive(code, initialLive);

  if (isLoading && !live) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="aspect-video w-full rounded-3xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !live) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">This live doesn&apos;t exist any more</p>
        <p className="mt-1.5 text-[13.5px] text-muted">The seller may have removed it. Find more sellers on Nestly.</p>
        <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Browse Nestly
        </Link>
      </div>
    );
  }

  if (live.status === "LIVE") return <DockedLive live={live} />;
  return <LiveInfo live={live} />;
}

// ---------------------------------------------------------------------------
// Before / after the live
// ---------------------------------------------------------------------------

function StoreLine({ live }: { live: PublicLive }) {
  return (
    <Link href={`/marketplace/seller/${live.store.slug}`} className="flex min-w-0 items-center gap-2.5">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
        {live.store.logo ? <Image src={live.store.logo} alt="" fill sizes="40px" className="object-cover" /> : <Store size={17} />}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[14px] font-semibold text-ink">
          <span className="truncate">{live.store.name}</span>
          {live.store.isVerified && <BadgeCheck size={15} className="shrink-0 text-violet-600" aria-label="Verified business" />}
        </span>
        {(live.store.city || live.store.state) && (
          <span className="block truncate text-[12px] text-muted">{[...new Set([live.store.city, live.store.state].filter(Boolean))].join(", ")}</span>
        )}
      </span>
    </Link>
  );
}

function useCountdownSeconds(targetIso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const left = Math.max(0, Math.floor((new Date(targetIso).getTime() - now) / 1000));
  return { days: Math.floor(left / 86400), hours: Math.floor((left % 86400) / 3600), minutes: Math.floor((left % 3600) / 60), seconds: left % 60, done: left === 0 };
}

function Countdown({ to }: { to: string }) {
  const { days, hours, minutes, seconds, done } = useCountdownSeconds(to);
  if (done) return <p className="text-[14px] font-semibold text-violet-700 dark:text-violet-300">Starting any moment - stay on this page.</p>;
  const parts = [
    ...(days ? [{ value: days, label: "days" }] : []),
    { value: hours, label: "hrs" },
    { value: minutes, label: "mins" },
    { value: seconds, label: "secs" },
  ];
  return (
    <div className="flex gap-2">
      {parts.map((part) => (
        <span key={part.label} className="flex w-16 flex-col items-center rounded-2xl bg-surface-sunken py-2.5">
          <span className="font-[family-name:var(--font-mono)] text-[22px] font-semibold text-ink">{String(part.value).padStart(2, "0")}</span>
          <span className="text-[10.5px] uppercase tracking-wide text-muted">{part.label}</span>
        </span>
      ))}
    </div>
  );
}

function ShareButton({ live }: { live: PublicLive }) {
  const share = async () => {
    const url = liveShareUrl(live.code, live.referralCode);
    const text = `${live.store.name} is going live on Nestly: ${live.title}`;
    try {
      if (navigator.share) return await navigator.share({ title: live.title, text, url });
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      // Share sheet closed.
    }
  };
  return (
    <button type="button" onClick={share} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink-2 hover:border-violet-300">
      <Share2 size={16} /> Share
    </button>
  );
}

function LiveInfo({ live }: { live: PublicLive }) {
  const { isLoggedIn } = useSession();
  const requireLogin = useRequireLogin();
  const { mutate: setReminder, isPending } = useLiveReminder(live.code);
  const [buying, setBuying] = useState<string | null>(null);
  const upcoming = live.status === "SCHEDULED";
  const shoppable = live.status === "ENDED" && live.discountActive;

  const remind = () => {
    if (!requireLogin("Create a free account and we'll remind you before the live starts.")) return;
    setReminder(!live.isInterested);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:pt-8">
      <section className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="relative aspect-video bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600">
          {live.coverImage && <Image src={live.coverImage} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur">
            {upcoming ? <Radio size={13} /> : <Clock size={13} />}
            {upcoming ? "Upcoming live" : live.status === "CANCELLED" ? "Cancelled" : "This live has ended"}
          </span>
          {!live.coverImage && <Video size={48} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70" />}
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StoreLine live={live} />
            {upcoming && (
              <span className="text-[12.5px] text-muted">
                <BellRing size={13} className="mr-1 inline" />
                {live.interestedCount.toLocaleString()} waiting
              </span>
            )}
          </div>

          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] leading-tight text-ink sm:text-[32px]">{live.title}</h1>
            <p className="mt-1.5 text-[14px] font-semibold text-violet-700 dark:text-violet-300">{liveWhen(live.scheduledAt)} (Nigeria time)</p>
            {live.description && <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink-2">{live.description}</p>}
          </div>

          {upcoming && <Countdown to={live.scheduledAt} />}

          {live.status === "CANCELLED" && (
            <p className="rounded-xl bg-surface-sunken p-3.5 text-[13px] text-ink-2">
              {live.endReason === "NOT_STARTED" ? "This live didn't go ahead." : "The seller cancelled this live."} Follow {live.store.name} to hear about their next one.
            </p>
          )}

          {live.isOwner ? (
            <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/30 dark:bg-violet-500/5">
              <p className="text-[14px] font-semibold text-ink">This is your live</p>
              <p className="mt-1 text-[13px] text-muted">Share this page so people tap &ldquo;Remind me&rdquo;. Go live from your studio.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/marketplace/live/${live.id}`} className="flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-[13.5px] font-semibold text-white">
                  <Video size={16} /> Open studio
                </Link>
                <ShareButton live={live} />
              </div>
            </div>
          ) : (
            upcoming && (
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <button
                  type="button"
                  onClick={remind}
                  disabled={isPending}
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold ${
                    live.isInterested
                      ? "border border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                  }`}
                >
                  {isPending ? <Loader2 size={17} className="animate-spin" /> : live.isInterested ? <BellRing size={17} /> : <Bell size={17} />}
                  {live.isInterested ? "You'll be reminded" : isLoggedIn ? "Remind me" : "Remind me - sign up free"}
                </button>
                <a href={liveCalendarUrl(live.code)} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink-2 hover:border-violet-300">
                  <CalendarPlus size={16} /> Add to calendar
                </a>
                <ShareButton live={live} />
              </div>
            )
          )}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-[15px] font-semibold text-ink">
          {upcoming ? "What's coming in this live" : "Products from this live"}
          {upcoming && live.products.some((p) => p.discountPercent) && <span className="ml-2 text-[12.5px] font-medium text-rose-600">Live-only prices during the live</span>}
        </h2>
        <ProductGrid
          products={live.products}
          upcoming={upcoming}
          onBuy={shoppable && !live.isOwner ? (id) => requireLogin("Log in or create a free account to buy.") && setBuying(id) : undefined}
        />
      </section>

      {buying && <LiveBuySheet live={live} productId={buying} onClose={() => setBuying(null)} />}
    </div>
  );
}

function ProductGrid({ products, upcoming, onBuy }: { products: LiveProduct[]; upcoming: boolean; onBuy?: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
          <Link href={`/marketplace/product/${product.slug}`} className="relative block aspect-square bg-surface-sunken">
            {product.image && <Image src={product.image} alt={product.title} fill sizes="(min-width: 640px) 240px, 50vw" className="object-cover" />}
            {product.discountPercent && (
              <span className="absolute left-2 top-2 rounded-md bg-rose-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                {upcoming ? `${product.discountPercent}% off live` : `-${product.discountPercent}%`}
              </span>
            )}
          </Link>
          <div className="space-y-1 p-3">
            <p className="line-clamp-2 text-[13px] font-semibold text-ink">{product.title}</p>
            <LivePrice product={product} size="sm" />
            {onBuy && (
              <button type="button" onClick={() => onBuy(product.id)} disabled={!product.available} className="mt-1.5 h-9 w-full rounded-xl bg-violet-600 text-[12.5px] font-semibold text-white disabled:bg-zinc-400">
                {product.available ? "Buy at live price" : "Sold out"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

