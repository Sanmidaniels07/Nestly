"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";

import { useLiveSummary, useMyLives } from "@/src/hooks/use-lives";
import { naira } from "@/src/lib/payment-link";
import Skeleton from "@/src/components/ui/skeleton";
import { liveWhen } from "@/src/components/live/live-ui";
import { DockedStudio } from "@/src/components/live/live-dock";

// The seller's live studio (Zoom-style): camera with zoom, go live, show
// products from the live or anywhere in the store, chat with moderation,
// end the live - then the summary.

export default function LiveStudioPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMyLives();
  const live = data?.lives.find((item) => item.id === id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-8">
        <Skeleton className="aspect-[9/16] w-full rounded-3xl" />
      </div>
    );
  }
  if (!live) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">Live not found</p>
        <Link href="/settings/marketplace?tab=lives" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Back to your lives
        </Link>
      </div>
    );
  }
  if (live.status === "ENDED") return <LiveSummaryView id={live.id} />;
  if (live.status === "CANCELLED") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">This live was cancelled</p>
        <Link href="/settings/marketplace?tab=lives" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Schedule a new one
        </Link>
      </div>
    );
  }
  return <DockedStudio live={live} />;
}

// ---------------------------------------------------------------------------
// After the live
// ---------------------------------------------------------------------------

function LiveSummaryView({ id }: { id: string }) {
  const { data: summary, isLoading } = useLiveSummary(id);

  if (isLoading || !summary) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const stats = [
    { icon: Eye, label: "Most watching at once", value: summary.peakViewers.toLocaleString() },
    { icon: ShoppingBag, label: "Orders", value: summary.orders.toLocaleString() },
    { icon: Heart, label: "Sales", value: naira(summary.revenue) },
    { icon: MessageCircle, label: "Chat messages", value: summary.chatMessages.toLocaleString() },
    { icon: UserPlus, label: "New followers", value: summary.newFollowers.toLocaleString() },
    { icon: Users, label: "New members from your links", value: summary.signUps.toLocaleString() },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6 sm:pt-8">
      <Link href="/settings/marketplace?tab=lives" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink">
        <ArrowLeft size={15} /> Your lives
      </Link>
      <p className="mt-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-violet-600">Live summary</p>
      <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink">{summary.title}</h1>
      <p className="mt-1 text-[13px] text-muted">
        {summary.startedAt ? liveWhen(summary.startedAt) : liveWhen(summary.scheduledAt)} · {summary.durationMinutes} min
        {summary.endReason === "TIME_LIMIT" && " · ended at the time limit"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-surface p-4">
            <stat.icon size={17} className="text-violet-600 dark:text-violet-400" />
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[20px] font-semibold text-ink">{stat.value}</p>
            <p className="text-[12px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-[14.5px] font-semibold text-ink">What sold</h2>
        {summary.topProducts.length === 0 ? (
          <p className="mt-2 text-[13px] text-muted">No orders this time. Tip: announce your next live a few days ahead and share the link in your status and bio.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {summary.topProducts.map((product) => (
              <li key={product.productId} className="flex items-center justify-between py-2.5 text-[13.5px]">
                <span className="min-w-0 truncate text-ink">
                  {product.title} <span className="text-muted">× {product.units}</span>
                </span>
                <span className="shrink-0 font-[family-name:var(--font-mono)] font-semibold text-ink">{naira(product.revenue)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[12px] text-muted">Orders from this live are in your Orders tab, like any other order. Live prices stay on for 30 minutes after a live ends.</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/settings/marketplace?tab=lives" className="flex h-11 items-center rounded-xl bg-violet-600 px-5 text-[13.5px] font-semibold text-white">
          Schedule another live
        </Link>
        <Link href="/settings/marketplace?tab=orders" className="flex h-11 items-center rounded-xl border border-line px-5 text-[13.5px] font-semibold text-ink-2">
          See orders
        </Link>
      </div>
    </div>
  );
}

