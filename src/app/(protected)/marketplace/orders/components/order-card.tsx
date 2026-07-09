"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Truck, RotateCcw, Check } from "lucide-react";

import OrderStatusBadge from "./order-status-badge";
import { useCartStore } from "@/src/store/cart-store";
import { MarketplaceOrder } from "@/src/mocks/order";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

interface Props {
  order: MarketplaceOrder;
}

export default function OrderCard({ order }: Props) {
  const firstItem = order.items[0];
  const addToCart = useCartStore((state) => state.addToCart);

  const [added, setAdded] = useState(false);

  const handleBuyAgain = () => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-colors hover:border-violet-200 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#F2F1F8] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
            Order number
          </p>
          <h3 className="mt-0.5 font-[family-name:var(--font-mono)] text-[15px] font-semibold text-[#13131A]">
            {order.orderNumber}
          </h3>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {/* Product */}
      <div className="flex gap-4 py-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F8F8FC]">
          <Image src={firstItem.product.images[0]} alt={firstItem.product.name} fill className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[15px] font-semibold text-[#13131A]">
            {firstItem.product.name}
          </h4>
          <p className="mt-0.5 text-[12.5px] text-[#64748B]">{firstItem.product.brand}</p>
          <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[12.5px] text-[#64748B]">
            Qty {firstItem.quantity}
          </p>

          {order.items.length > 1 && (
            <p className="mt-1 text-[12.5px] font-medium text-violet-600">
              + {order.items.length - 1} more item{order.items.length - 1 !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="grid gap-4 border-t border-[#F2F1F8] py-4 sm:grid-cols-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50">
            <Calendar size={14} className="text-violet-600" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Ordered</p>
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium text-[#13131A]">
              {order.createdAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50">
            <Truck size={14} className="text-violet-600" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Delivery</p>
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium text-[#13131A]">
              {order.estimatedDelivery}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-[#94A3B8]">Total</p>
          <p className="font-[family-name:var(--font-mono)] text-[16px] font-semibold text-violet-700">
            {money(order.total)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        <Link
          href={`/marketplace/orders/${order.id}`}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:brightness-110"
        >
          View details
          <ChevronRight size={14} />
        </Link>

        <Link
          href={`/marketplace/orders/${order.id}?tab=tracking`}
          className="rounded-xl border border-[#ECE9F6] px-4 py-2.5 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]"
        >
          Track order
        </Link>

        <button
          onClick={handleBuyAgain}
          className={`
            flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-colors
            ${added ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#ECE9F6] text-[#334155] hover:bg-[#F8F7FC]"}
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
      </div>
    </article>
  );
}