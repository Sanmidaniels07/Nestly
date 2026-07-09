"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MarketplaceOrder } from "@/src/mocks/order";

interface Props {
  order: MarketplaceOrder;
}

const statusStyles: Record<MarketplaceOrder["status"], string> = {
  Processing: "bg-amber-50 text-amber-700",
  Paid: "bg-sky-50 text-sky-700",
  Shipped: "bg-violet-50 text-violet-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function RecentOrderRow({ order }: Props) {
  return (
    <tr className="border-t border-[#F2F1F8]">
      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[#13131A]">
        {order.orderNumber}
      </td>

      <td className="max-w-[160px] truncate px-5 py-4 text-[13px] text-[#334155]">
        {order.shippingAddress.fullName}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[#13131A]">
        ₦{order.total.toLocaleString()}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${statusStyles[order.status]}`}>
          {order.status}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
        {order.createdAt}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <Link
          href={`/orders/${order.id}`}
          aria-label="View order"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F7FB] text-[#64748B] transition-colors hover:bg-[#EFEDF9] hover:text-violet-600"
        >
          <ChevronRight size={15} />
        </Link>
      </td>
    </tr>
  );
}