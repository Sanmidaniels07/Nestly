"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, MessageSquarePlus, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { Order, OrderEvent, OrderItem } from "@/src/types/order";
import { useConfirmDelivery } from "@/src/hooks/use-confirm-delivery";
import WriteReviewForm from "./write-review-form";
import RequestReturnForm from "./request-return-form";
import OrderedSnapshot from "./ordered-snapshot";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

const CONFIRMED_BY_COPY = {
  CODE: "with your delivery code",
  BUYER: "by you",
  AUTO: "automatically",
} as const;

interface Props {
  order: Order;
}

export default function OrderedProducts({ order }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Ordered products
      </h2>

      <div className="mt-6 space-y-4">
        {order.items.map((item) => (
          <OrderedProductItem
            key={item.id}
            orderId={order.id}
            item={item}
            orderStatus={order.status}
            events={(order.events ?? []).filter((event) => event.orderItemId === item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function OrderedProductItem({
  orderId,
  item,
  orderStatus,
  events,
}: {
  orderId: string;
  item: OrderItem;
  orderStatus: string;
  events: OrderEvent[];
}) {
  const [reviewing, setReviewing] = useState(false);
  const [returnMode, setReturnMode] = useState<"return" | "problem" | null>(null);
  const { mutate: confirmDelivery, isPending: isConfirming } = useConfirmDelivery(orderId);

  const primaryImage =
    item.product.images.find((image) => image.isPrimary)?.url ?? item.product.images[0]?.url;

  const status = (item.status ?? orderStatus).toUpperCase();
  const isDelivered = status === "DELIVERED";
  const problemReported = events.some((event) => event.type === "PROBLEM_REPORTED");
  const withinReturnWindow = item.returnWindowOpen ?? true;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-line p-4 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 sm:flex-row sm:p-5">
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:w-28">
        {primaryImage && (
          <Image fill src={primaryImage} alt={item.product.title} className="object-cover" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            {(item.productBrand ?? item.product.brand) && (
              <p className="text-[12px] font-medium text-violet-600 dark:text-violet-400">{item.productBrand ?? item.product.brand}</p>
            )}
            <h3 className="mt-0.5 truncate text-[15px] font-semibold text-ink">
              {item.product.title}
            </h3>
            {item.variantLabel && (
              <p className="mt-1 text-[13px] font-medium text-ink-2">{item.variantLabel}</p>
            )}
            {item.product.store && (
              <p className="mt-1.5 text-[12.5px] text-muted">
                Sold by{" "}
                <span className="font-medium text-ink-2">{item.product.store.name}</span>
              </p>
            )}

            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-[11px] text-subtle">Quantity</p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-ink">
                  {item.quantity}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-subtle">Unit price</p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-ink">
                  {money(item.unitPrice)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-subtle">Total</p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700 dark:text-violet-300">
                  {money(item.totalPrice)}
                </p>
              </div>
            </div>

            <ItemStatusLine item={item} status={status} />
          </div>

          <div className="flex shrink-0 flex-wrap gap-2.5 sm:flex-col">
            {/* Payment-link items have no product page. */}
            {item.product.status !== "PRIVATE" && (
              <Link
                href={`/marketplace/product/${item.productId}`}
                className="flex h-10 items-center justify-center rounded-xl border border-line px-4 text-[12.5px] font-semibold text-ink-2 transition-colors hover:bg-surface-sunken"
              >
                {item.listingChanged ? "View current listing" : "View product"}
              </Link>
            )}

            {isDelivered && !item.awaitingConfirmation && !reviewing && (
              <button
                onClick={() => setReviewing(true)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-4 text-[12.5px] font-semibold text-violet-700 transition-colors hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
              >
                <MessageSquarePlus size={14} />
                Write a review
              </button>
            )}

            {isDelivered && !item.awaitingConfirmation && withinReturnWindow && !problemReported && returnMode === null && (
              <button
                onClick={() => setReturnMode("return")}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-amber-200 px-4 text-[12.5px] font-semibold text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
              >
                <RotateCcw size={14} />
                Request return
              </button>
            )}
          </div>
        </div>

        <OrderedSnapshot item={item} />

        {item.awaitingConfirmation && !problemReported && returnMode === null && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <p className="text-[13.5px] font-semibold text-amber-800 dark:text-amber-200">Did you receive this item?</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-amber-800/80 dark:text-amber-200/80">
              The seller marked it as delivered. Confirm if you have it, or report a problem. If we don&apos;t hear from you,
              it&apos;s confirmed automatically after 5 days.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => confirmDelivery(item.id)}
                disabled={isConfirming}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                <CheckCircle2 size={15} />
                {isConfirming ? "Confirming..." : "Yes, I received it"}
              </button>
              <button
                onClick={() => setReturnMode("problem")}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-amber-300 bg-surface px-4 text-[12.5px] font-semibold text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-500/40 dark:text-amber-200 dark:hover:bg-amber-500/15"
              >
                <AlertTriangle size={15} />
                Report a problem
              </button>
            </div>
          </div>
        )}

        {problemReported && (
          <p className="flex items-start gap-2 rounded-xl bg-surface-sunken px-3.5 py-2.5 text-[12.5px] text-muted">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            You reported a problem with this item. The seller has been notified - track it under your returns.
          </p>
        )}

        {reviewing && (
          <WriteReviewForm productId={item.productId} onDone={() => setReviewing(false)} />
        )}

        {returnMode && (
          <RequestReturnForm orderItemId={item.id} mode={returnMode} onDone={() => setReturnMode(null)} />
        )}
      </div>
    </article>
  );
}

function ItemStatusLine({ item, status }: { item: OrderItem; status: string }) {
  if (status === "DELIVERED" && item.deliveryConfirmedAt) {
    return (
      <div className="mt-3 space-y-0.5">
        <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-700 dark:text-emerald-400">
          <PackageCheck size={14} />
          Delivered {shortDate(item.deliveryConfirmedAt)} · confirmed{" "}
          {item.deliveryConfirmedBy ? CONFIRMED_BY_COPY[item.deliveryConfirmedBy] : ""}
        </p>
        {item.returnWindowEndsAt && (
          <p className="text-[11.5px] text-subtle">
            {item.returnWindowOpen
              ? `Returns open until ${shortDate(item.returnWindowEndsAt)}`
              : "Return window closed"}
          </p>
        )}
      </div>
    );
  }

  if (status === "DELIVERED") {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-amber-700 dark:text-amber-300">
        <PackageCheck size={14} />
        Marked delivered{item.deliveredAt ? ` ${shortDate(item.deliveredAt)}` : ""} · awaiting your confirmation
      </p>
    );
  }

  if (status === "SHIPPED") {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-sky-700 dark:text-sky-300">
        <Truck size={14} />
        On its way{item.shippedAt ? ` · shipped ${shortDate(item.shippedAt)}` : ""}
      </p>
    );
  }

  const label: Record<string, string> = {
    PENDING: "Waiting for the seller",
    PROCESSING: "Being prepared",
    CANCELLED: "Cancelled",
  };

  return (
    <p className={`mt-3 text-[12.5px] font-medium ${status === "CANCELLED" ? "text-red-600 dark:text-red-400" : "text-muted"}`}>
      {label[status] ?? status.toLowerCase()}
    </p>
  );
}
