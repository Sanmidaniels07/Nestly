"use client";

import { RotateCcw, Download, MapPinned } from "lucide-react";
import { MarketplaceOrder } from "@/src/mocks/order";
interface Props {
  order: MarketplaceOrder;
}

export default function OrderActions({ order }: Props) {
  const canCancel = order.status !== "Delivered" && order.status !== "Cancelled";

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Actions
      </h2>

      <div className="mt-5 space-y-2.5">
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13px] font-semibold text-white transition-all hover:brightness-110">
          <MapPinned size={16} />
          Track order
        </button>

        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] text-[13px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]">
          <Download size={16} />
          Download invoice
        </button>

        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] text-[13px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]">
          <RotateCcw size={16} />
          Buy again
        </button>

        {canCancel && (
          <button className="flex h-12 w-full items-center justify-center rounded-xl border border-red-200 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50">
            Cancel order
          </button>
        )}
      </div>
    </section>
  );
}