"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Truck } from "lucide-react";

import { useSellerOrders } from "@/src/hooks/use-seller-orders";
import { useUpdateOrderItemStatus } from "@/src/hooks/use-update-order-item-status";
import { useUpdateTrackingNumber } from "@/src/hooks/use-update-tracking-number";
import { Order } from "@/src/types/order";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

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
  const { mutate: updateStatus } = useUpdateOrderItemStatus();

  const orders = data?.orders ?? [];

  if (isLoading) {
    return <ListSkeleton count={4} withAvatar={false} />;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
        <p className="text-[13.5px] text-[#94A3B8]">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2F1F8] pb-4">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="mt-0.5 text-[12.5px] text-[#64748B]">
                {formatRelativeTime(order.createdAt)}
              </p>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-violet-700">
              {money(order.total)}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {order.items.map((item) => {
              const primaryImage =
                item.product.images.find((image) => image.isPrimary)?.url ??
                item.product.images[0]?.url;

              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-[#F2F1F8] p-4"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F8F8FC]">
                    {primaryImage && (
                      <Image src={primaryImage} alt={item.product.title} fill className="object-cover" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                      {item.product.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#94A3B8]">
                      Qty {item.quantity} · {money(item.unitPrice)}
                    </p>
                  </div>

                  <select
                    value={item.status ?? "PENDING"}
                    onChange={(e) => updateStatus({ orderItemId: item.id, status: e.target.value })}
                    className="h-10 rounded-lg border border-[#ECE9F6] bg-white px-3 text-[12.5px] font-medium text-[#334155] outline-none transition-colors focus:border-violet-400"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <TrackingNumberInput order={order} />
        </div>
      ))}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
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
    <div className="mt-4 flex items-center gap-2 border-t border-[#F2F1F8] pt-4">
      <Truck size={15} className="shrink-0 text-[#94A3B8]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add tracking number"
        className="h-9 flex-1 rounded-lg border border-[#ECE9F6] bg-white px-3 text-[12.5px] text-[#334155] outline-none transition-colors focus:border-violet-400"
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
