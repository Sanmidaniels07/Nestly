import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

import { Order } from "@/src/types/order";

const COPY: Record<NonNullable<Order["gift"]>["status"], string> = {
  UNPAID: "Payment wasn't finished, so nothing was sent.",
  SENT: "Waiting for them to accept it and add their delivery address. Share the gift link if you haven't.",
  CLAIMED: "They accepted it - the seller is delivering it to them. Their address and delivery code stay private to them.",
  DECLINED: "They declined it, so you've been refunded in full.",
  EXPIRED: "It wasn't accepted within 7 days, so you've been refunded in full.",
  CANCELLED: "You cancelled it and have been refunded in full.",
};

// This order is a gift: no address or delivery code here - the gift page
// has the link to share, its progress and Cancel gift.
export default function GiftNotice({ order }: { order: Order }) {
  if (!order.gift) return null;
  const { gift } = order;

  return (
    <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-5 dark:border-violet-500/30 dark:from-violet-500/10 dark:to-fuchsia-500/5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
        <Gift size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">A gift for {gift.recipientName}</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-ink-3">{COPY[gift.status]}</p>
      </div>
      <Link
        href={`/gift/${gift.code}`}
        className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white hover:brightness-110"
      >
        Open gift <ArrowRight size={14} />
      </Link>
    </section>
  );
}
