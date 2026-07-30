"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SellerRecentOrder } from "@/src/services/seller-dashboard.services";
import { formatRelativeTime } from "@/src/lib/date";

interface Props {
  order: SellerRecentOrder;
}

const statusStyles: Record<string, string> = {
  processing: "bg-amber-50 text-amber-700",
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-sky-50 text-sky-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function RecentOrderRow({ order }: Props) {
  const tone = statusStyles[order.status.toLowerCase()] ?? "bg-[#F1F0F5] text-[#64748B]";

  return (
    <tr className="border-t border-[#F2F1F8]">
      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[#13131A]">
        #{order.id.slice(-8).toUpperCase()}
      </td>

      <td className="max-w-[160px] truncate px-5 py-4 text-[13px] text-[#334155]">
        {order.customer.name}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[#13131A]">
        ₦{order.sellerSubtotal.toLocaleString()}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium capitalize ${tone}`}>
          {order.status.toLowerCase()}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
        {formatRelativeTime(order.createdAt)}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <Link
          href={`/marketplace/orders/${order.id}`}
          aria-label="View order"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F7FB] text-[#64748B] transition-colors hover:bg-[#EFEDF9] hover:text-violet-600"
        >
          <ChevronRight size={15} />
        </Link>
      </td>
    </tr>
  );
}
