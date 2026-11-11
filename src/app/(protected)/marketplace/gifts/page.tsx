"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift as GiftIcon, Inbox, Send } from "lucide-react";

import { useGiftList } from "@/src/hooks/use-gifts";
import Skeleton from "@/src/components/ui/skeleton";
import { Gift, GiftStatus } from "@/src/types/gift";

const STATUS: Record<GiftStatus, { label: string; tone: string }> = {
  UNPAID: { label: "Not paid", tone: "bg-surface-2 text-muted" },
  SENT: { label: "Waiting to be accepted", tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200" },
  CLAIMED: { label: "Accepted", tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200" },
  DECLINED: { label: "Declined · refunded", tone: "bg-surface-2 text-muted" },
  EXPIRED: { label: "Expired · refunded", tone: "bg-surface-2 text-muted" },
  CANCELLED: { label: "Cancelled · refunded", tone: "bg-surface-2 text-muted" },
};

export default function GiftsPage() {
  const [box, setBox] = useState<"sent" | "received">("received");
  const { data, isLoading } = useGiftList(box);
  const gifts = data?.gifts ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
            <GiftIcon size={20} />
          </span>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">Gifts</p>
            <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[32px] text-ink sm:text-[38px]">Your gifts</h1>
          </div>
        </div>
        <Link href="/marketplace" className="text-[13px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Find a gift
        </Link>
      </div>

      <div role="tablist" className="flex gap-1 rounded-2xl border border-line bg-surface p-1">
        {([
          { key: "received", label: "Received", icon: Inbox },
          { key: "sent", label: "Sent", icon: Send },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={box === key}
            onClick={() => setBox(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13.5px] font-semibold transition-colors ${
              box === key ? "bg-violet-600 text-white shadow-sm" : "text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : gifts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line-strong bg-surface/60 px-8 py-16 text-center">
          <GiftIcon className="mx-auto h-9 w-9 text-violet-400" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-ink">{box === "received" ? "No gifts yet" : "You haven't sent a gift yet"}</p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted">
            {box === "received"
              ? "Share your wishlist with your followers - they can send you anything on it without needing your address."
              : "Open any product and tap “Send as a gift”. They add their own address, and you're refunded if they don't accept it."}
          </p>
          <Link
            href={box === "received" ? "/marketplace/saved" : "/marketplace"}
            className="mt-5 inline-block rounded-xl bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            {box === "received" ? "Share my wishlist" : "Browse the marketplace"}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {gifts.map((gift) => (
            <GiftRow key={gift.code} gift={gift} box={box} />
          ))}
        </ul>
      )}
    </div>
  );
}

function GiftRow({ gift, box }: { gift: Gift; box: "sent" | "received" }) {
  const status = STATUS[gift.status];
  return (
    <li>
      <Link
        href={`/gift/${gift.code}`}
        className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3.5 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
      >
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
          {gift.item?.image && <Image src={gift.item.image} alt="" fill sizes="64px" className="object-cover" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold text-ink">{gift.item?.title ?? "Gift"}</span>
          <span className="block truncate text-[12.5px] text-muted">
            {box === "sent" ? `For ${gift.recipientName}` : `From ${gift.sender.name}`}
          </span>
          <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.tone}`}>{status.label}</span>
        </span>
      </Link>
    </li>
  );
}
