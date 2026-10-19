"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SellerRecentOrder } from "@/src/services/seller-dashboard.services";
import { formatRelativeTime } from "@/src/lib/date";

interface Props {
  order: SellerRecentOrder;
}

const statusStyles: Record<string, string> = {
  processing: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  paid: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300",
  shipped: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300",
  delivered: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
};

export default function RecentOrderRow({ order }: Props) {
  const tone = statusStyles[order.status.toLowerCase()] ?? "bg-surface-muted text-muted";

  return (
    <tr className="border-t border-line-soft">
      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-ink">
        #{order.id.slice(-8).toUpperCase()}
      </td>

      <td className="max-w-[160px] truncate px-5 py-4 text-[13px] text-ink-2">
        {order.customer.name}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-ink">
        ₦{order.sellerSubtotal.toLocaleString()}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium capitalize ${tone}`}>
          {order.status.toLowerCase()}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[12.5px] text-subtle">
        {formatRelativeTime(order.createdAt)}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <Link
          // /marketplace/orders/:id is the buyer's page (404s for the seller) -
          // open this order in the seller's Orders tab instead.
          href={`/settings/marketplace?tab=orders&order=${order.id}`}
          aria-label="View order"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-muted transition-colors hover:bg-surface-muted hover:text-violet-600 dark:hover:text-violet-400"
        >
          <ChevronRight size={15} />
        </Link>
      </td>
    </tr>
  );
}
