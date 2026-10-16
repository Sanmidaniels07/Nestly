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
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      {/* Sellers reach this from their dashboard and buyers from My orders -
          go back to wherever they came from rather than always to My orders. */}
      <BackButton fallbackHref="/marketplace/orders" />

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[13px] text-muted">Order number</p>
          <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[28px] italic text-ink">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-7 grid gap-5 border-t border-dashed border-line pt-6 md:grid-cols-2">
        <div>
          <p className="text-[12px] uppercase tracking-wide text-subtle">Ordered on</p>
          <p className="mt-1 text-[13.5px] font-semibold text-ink">
            {formatRelativeTime(order.createdAt)}
          </p>
        </div>
        {order.paymentMethod && (
          <div>
            <p className="text-[12px] uppercase tracking-wide text-subtle">Payment method</p>
            <p className="mt-1 text-[13.5px] font-semibold text-ink">
              {order.paymentMethod}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
