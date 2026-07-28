"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusBadge from "../../components/order-status-badge";
import { Order } from "@/src/types/order";
import { formatRelativeTime } from "@/src/lib/date";

interface Props {
  order: Order;
}

export default function OrderHeader({ order }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <Link
        href="/marketplace/orders"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-violet-600"
      >
        <ArrowLeft size={15} />
        Back to orders
      </Link>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[13px] text-[#64748B]">Order number</p>
          <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[28px] italic text-[#13131A]">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-7 grid gap-5 border-t border-dashed border-[#ECE9F6] pt-6 md:grid-cols-2">
        <div>
          <p className="text-[12px] uppercase tracking-wide text-[#94A3B8]">Ordered on</p>
          <p className="mt-1 text-[13.5px] font-semibold text-[#13131A]">
            {formatRelativeTime(order.createdAt)}
          </p>
        </div>
        {order.paymentMethod && (
          <div>
            <p className="text-[12px] uppercase tracking-wide text-[#94A3B8]">Payment method</p>
            <p className="mt-1 text-[13.5px] font-semibold text-[#13131A]">
              {order.paymentMethod}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
