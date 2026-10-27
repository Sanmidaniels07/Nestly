"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Check, RotateCcw } from "lucide-react";

import OrderStatusBadge from "./order-status-badge";
import { useAddToCart } from "@/src/hooks/use-add-to-cart";
import { Order } from "@/src/types/order";
import { formatRelativeTime } from "@/src/lib/date";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const firstItem = order.items[0];
  const { mutate: addToCart } = useAddToCart();

  const [added, setAdded] = useState(false);
  // Payment-link items can only be bought through the seller's link.
  const canBuyAgain = !order.items.some((item) => item.product.status === "PRIVATE");

  const primaryImage =
    firstItem?.product.images.find((image) => image.isPrimary)?.url ??
    firstItem?.product.images[0]?.url;

  const handleBuyAgain = () => {
    order.items.forEach((item) => {
      addToCart({ productId: item.productId, quantity: item.quantity, variationId: item.variationId ?? undefined });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)] sm:p-6">
      <div className="flex flex-col gap-3 border-b border-line-soft pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[12px] text-subtle">
            Order number
          </p>
          <h3 className="mt-0.5 font-[family-name:var(--font-mono)] text-[15px] font-semibold text-ink">
            #{order.id.slice(-8).toUpperCase()}
          </h3>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {firstItem && (
        <div className="flex gap-4 py-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
            {primaryImage && (
              <Image src={primaryImage} alt={firstItem.product.title} fill className="object-cover" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-[15px] font-semibold text-ink">
              {firstItem.product.title}
            </h4>
            {firstItem.product.brand && (
              <p className="mt-0.5 text-[12.5px] text-muted">{firstItem.product.brand}</p>
            )}
            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[12.5px] text-muted">
              Qty {firstItem.quantity}
            </p>

            {order.items.length > 1 && (
              <p className="mt-1 text-[12.5px] font-medium text-violet-600 dark:text-violet-400">
                + {order.items.length - 1} more item{order.items.length - 1 !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 border-t border-line-soft py-4 sm:grid-cols-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
            <Calendar size={14} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-[11px] text-subtle">Ordered</p>
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium text-ink">
              {formatRelativeTime(order.createdAt)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-subtle">Total</p>
          <p className="font-[family-name:var(--font-mono)] text-[16px] font-semibold text-violet-700 dark:text-violet-300">
            {money(order.total)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Link
          href={`/marketplace/orders/${order.id}`}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:brightness-110"
        >
          View details
          <ChevronRight size={14} />
        </Link>

        {canBuyAgain && (
          <button
            onClick={handleBuyAgain}
            className={`
              flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-colors
              ${added ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-line text-ink-2 hover:bg-surface-sunken"}
            `}
          >
            {added ? (
              <>
                <Check size={14} />
                Added to cart
              </>
            ) : (
              <>
                <RotateCcw size={14} />
                Buy again
              </>
          )}
        </button>
        )}
      </div>
    </article>
  );
}
