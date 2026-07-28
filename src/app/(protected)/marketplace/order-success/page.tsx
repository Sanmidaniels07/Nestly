"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useOrder } from "@/src/hooks/use-order";
import SuccessHero from "./components/success-hero";
import OrderSummaryCard from "./components/order-summary-card";
import NextActions from "./components/next-actions";
import OrderTimeline from "../orders/[id]/components/order-timeline";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-[14px] text-[#94A3B8]">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-[15px] font-medium text-[#13131A]">Order not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <SuccessHero orderId={order.id} />
      <OrderSummaryCard order={order} />
      {order.timeline && order.timeline.length > 0 && <OrderTimeline order={order} />}
      <NextActions />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-16 text-center text-[14px] text-[#94A3B8]">
          Loading order...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
