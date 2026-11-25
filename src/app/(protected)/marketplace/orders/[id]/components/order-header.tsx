"use client";

import OrderStatusBadge from "../../components/order-status-badge";
import { Order } from "@/src/types/order";
import { formatRelativeTime } from "@/src/lib/date";
import BackButton from "@/src/components/ui/back-button";

interface Props {
  order: Order;
}

export default function OrderHeader({ order }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      {/* Sellers reach this from their dashboard and buyers from My orders -
          go back to wherever they came from rather than always to My orders. */}
      <BackButton fallbackHref="/marketplace/orders" />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-fraunces)] text-[24px] leading-tight text-ink sm:text-[28px]">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Placed {formatRelativeTime(order.createdAt)}
            {order.paymentMethod ? ` · Paid with ${order.paymentMethod.charAt(0) + order.paymentMethod.slice(1).toLowerCase()}` : ""}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

    </section>
  );
}
