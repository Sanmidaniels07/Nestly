"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, KeyRound, Store, Truck } from "lucide-react";

import { useSellerOrders } from "@/src/hooks/use-seller-orders";
import { useUpdateOrderItemStatus } from "@/src/hooks/use-update-order-item-status";
import { useUpdateTrackingNumber } from "@/src/hooks/use-update-tracking-number";
import { Order, OrderItem } from "@/src/types/order";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_RANK: Record<string, number> = { PENDING: 0, PROCESSING: 1, SHIPPED: 2, DELIVERED: 3, CANCELLED: -1 };

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrdersView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerOrders({ page, limit: 10 });

  const orders = data?.orders ?? [];

  // ?order=<id> (from the dashboard's recent orders or a notification) -
  // bring that order's card into view and highlight it.
  const focusedOrderId = useSearchParams().get("order");

  useEffect(() => {
    if (!focusedOrderId || orders.length === 0) return;
    document
      .getElementById(`order-${focusedOrderId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusedOrderId, orders.length]);

  if (isLoading) {
    return <ListSkeleton count={4} withAvatar={false} />;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
        <p className="text-[13.5px] text-subtle">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        // Sellers only receive their own shipment row (never the buyer's code).
        const shipment = order.shipping?.[0];
        const isPickup = shipment?.type === "PICKUP";
        const earnings = sellerEarnings(order);

        return (
        <div
          key={order.id}
          id={`order-${order.id}`}
          className={`scroll-mt-24 rounded-2xl border bg-surface p-4 sm:p-6 ${
            order.id === focusedOrderId
              ? "border-violet-400 ring-2 ring-violet-500/20 dark:border-violet-500"
              : "border-line"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft pb-4">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[12px] text-subtle">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="mt-0.5 text-[12.5px] text-muted">
                {formatRelativeTime(order.createdAt)}
              </p>
              {shipment && (
                <p
                  className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${
                    isPickup
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "bg-surface-2 text-ink-2"
                  }`}
                >
                  {isPickup ? <Store size={11} /> : <Truck size={11} />}
                  {isPickup ? "Buyer will pick up" : shipment.optionName}
                </p>
              )}
            </div>
            {/* The seller's own take - order.total includes other stores' items. */}
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-subtle">
                {earnings.cancelled ? "Cancelled" : "You receive"}
              </p>
              <p
                className={`font-[family-name:var(--font-mono)] text-[15px] font-semibold ${
                  earnings.cancelled ? "text-subtle line-through" : "text-violet-700 dark:text-violet-300"
                }`}
              >
                {money(earnings.receive)}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <SellerOrderItem key={item.id} item={item} isPickup={isPickup} />
            ))}
          </div>

          <EarningsBreakdown earnings={earnings} isPickup={isPickup} />

          {/* Nothing to track when the buyer collects. */}
          {!isPickup && <TrackingNumberInput order={order} />}
        </div>
        );
      })}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

interface Earnings {
  itemsTotal: number;
  commission: number;
  /** Single rate when every item shares it, otherwise null ("varies"). */
  rate: number | null;
  delivery: number;
  receive: number;
  cancelled: boolean;
}

// What this seller earns from the order: their items (minus commission at
// the rate locked in at checkout) plus their full delivery fee. Cancelled
// items don't count.
function sellerEarnings(order: Order): Earnings {
  const active = order.items.filter((item) => item.status !== "CANCELLED");
  const cancelled = order.status === "CANCELLED" || active.length === 0;
  // A cancelled order still shows (struck through) what it would have paid.
  const counted = cancelled ? order.items : active;

  const itemsTotal = counted.reduce((sum, item) => sum + item.totalPrice, 0);
  const commission = counted.reduce(
    (sum, item) => sum + Math.round((item.totalPrice * (item.commissionRate ?? 0)) / 100),
    0
  );
  const rates = new Set(counted.map((item) => item.commissionRate ?? 0));
  const delivery = order.shipping?.[0]?.fee ?? 0;

  return {
    itemsTotal,
    commission,
    rate: rates.size === 1 ? [...rates][0] : null,
    delivery,
    receive: itemsTotal - commission + delivery,
    cancelled,
  };
}

function EarningsBreakdown({ earnings, isPickup }: { earnings: Earnings; isPickup: boolean }) {
  if (earnings.cancelled) {
    return (
      <p className="mt-4 rounded-xl bg-surface-sunken px-4 py-3 text-[12.5px] text-muted">
        This order was cancelled, so there&apos;s nothing to receive.
      </p>
    );
  }

  const row = (label: string, value: string, tone = "text-ink-2") => (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className={`font-[family-name:var(--font-mono)] font-medium ${tone}`}>{value}</span>
    </div>
  );

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-line-soft bg-surface-sunken px-4 py-3.5 text-[12.5px]">
      {row("Items", money(earnings.itemsTotal))}
      {row(
        earnings.rate !== null ? `Nestly commission (${earnings.rate}%)` : "Nestly commission",
        `−${money(earnings.commission)}`,
        "text-red-600 dark:text-red-400"
      )}
      {!isPickup && earnings.delivery > 0 &&
        row("Delivery fee (yours in full)", `+${money(earnings.delivery)}`, "text-emerald-700 dark:text-emerald-400")}
      <div className="flex items-center justify-between gap-3 border-t border-dashed border-line pt-2">
        <span className="font-semibold text-ink">You receive</span>
        <span className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-violet-700 dark:text-violet-300">
          {money(earnings.receive)}
        </span>
      </div>
      <p className="pt-0.5 text-[11.5px] leading-snug text-subtle">
        Before Paystack&apos;s processing fee, which is shared by amount and deducted when Paystack pays you.
      </p>
    </div>
  );
}

// For pickup orders, "shipped" means ready to collect and "delivered" means picked up.
const PICKUP_LABELS: Record<string, string> = { SHIPPED: "Ready for pickup", DELIVERED: "Picked up" };

function SellerOrderItem({ item, isPickup }: { item: OrderItem; isPickup: boolean }) {
  const { mutate: updateStatus, isPending } = useUpdateOrderItemStatus();
  const [delivering, setDelivering] = useState(false);
  const [code, setCode] = useState("");

  const status = item.status ?? "PENDING";
  const isFinal = status === "DELIVERED" || status === "CANCELLED";
  const primaryImage =
    item.product.images.find((image) => image.isPrimary)?.url ?? item.product.images[0]?.url;

  const handleSelect = (next: string) => {
    // Delivering goes through the code step instead of applying straight away.
    if (next === "DELIVERED") {
      setDelivering(true);
      return;
    }
    updateStatus({ orderItemId: item.id, status: next });
  };

  const markDelivered = (deliveryCode?: string) =>
    updateStatus(
      { orderItemId: item.id, status: "DELIVERED", deliveryCode },
      {
        onSuccess: () => {
          setDelivering(false);
          setCode("");
        },
      }
    );

  return (
    <div className="rounded-xl border border-line-soft p-3.5 sm:p-4">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
          {primaryImage && <Image src={primaryImage} alt={item.product.title} fill className="object-cover" />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium text-ink">{item.product.title}</p>
          <p className="mt-0.5 text-[12px] text-subtle">
            Qty {item.quantity} · {money(item.unitPrice)}
          </p>
          <DeliveryState item={item} />
        </div>

        <select
          value={status}
          disabled={isFinal || isPending}
          onChange={(e) => handleSelect(e.target.value)}
          className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-[12.5px] font-medium text-ink-2 outline-none transition-colors focus:border-violet-400 disabled:opacity-60 sm:w-auto"
          aria-label="Item status"
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
              // Status only moves forward; delivered items can't be cancelled.
              disabled={option !== status && option !== "CANCELLED" && STATUS_RANK[option] <= STATUS_RANK[status]}
            >
              {(isPickup && PICKUP_LABELS[option]) || option.charAt(0) + option.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {delivering && (
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/30 dark:bg-violet-500/10">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <KeyRound size={14} className="text-violet-600 dark:text-violet-400" />
            Enter the buyer&apos;s {isPickup ? "pickup" : "delivery"} code
          </p>
          <p className="mt-1 text-[12.5px] text-muted">
            Ask the buyer for their 6-digit code when you hand the order over. It confirms {isPickup ? "pickup" : "delivery"} instantly.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              aria-label="Delivery code"
              className="h-11 rounded-xl border border-line bg-surface px-4 text-center font-[family-name:var(--font-mono)] text-[18px] tracking-[0.4em] text-ink outline-none focus:border-violet-400 sm:w-44"
            />
            <button
              onClick={() => markDelivered(code)}
              disabled={code.length !== 6 || isPending}
              className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
            >
              {isPending ? "Confirming..." : "Confirm delivery"}
            </button>
            <button
              onClick={() => setDelivering(false)}
              className="h-11 rounded-xl px-4 text-[13px] font-medium text-muted hover:bg-surface-2"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={() => markDelivered()}
            disabled={isPending}
            className="mt-3 text-left text-[12.5px] font-medium text-violet-700 hover:underline disabled:opacity-50 dark:text-violet-300"
          >
            Buyer can&apos;t give the code? Mark delivered without it - they&apos;ll be asked to confirm.
          </button>
        </div>
      )}
    </div>
  );
}

function DeliveryState({ item }: { item: OrderItem }) {
  if (item.status !== "DELIVERED") return null;

  if (item.deliveryConfirmedAt) {
    const by = item.deliveryConfirmedBy === "CODE" ? "with code" : item.deliveryConfirmedBy === "BUYER" ? "by buyer" : "automatically";
    return (
      <p className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 size={12} /> Delivery confirmed {by}
      </p>
    );
  }

  return (
    <p className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-amber-700 dark:text-amber-300">
      <Clock size={12} /> Waiting for the buyer to confirm
    </p>
  );
}

function TrackingNumberInput({ order }: { order: Order }) {
  const [value, setValue] = useState(order.trackingNumber ?? "");
  const { mutate: updateTracking, isPending } = useUpdateTrackingNumber();

  useEffect(() => {
    setValue(order.trackingNumber ?? "");
  }, [order.trackingNumber]);

  const canSave = value.trim().length > 0 && value.trim() !== (order.trackingNumber ?? "");

  return (
    <div className="mt-4 flex items-center gap-2 border-t border-line-soft pt-4">
      <Truck size={15} className="shrink-0 text-subtle" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add tracking number"
        className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-[12.5px] text-ink-2 outline-none transition-colors focus:border-violet-400"
      />
      <button
        onClick={() => updateTracking({ id: order.id, trackingNumber: value.trim() })}
        disabled={!canSave || isPending}
        className="h-9 shrink-0 rounded-lg bg-violet-600 px-3.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save
      </button>
    </div>
  );
}
