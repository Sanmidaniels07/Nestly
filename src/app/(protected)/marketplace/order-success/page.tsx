"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock3, PackageSearch } from "lucide-react";

import { useOrder } from "@/src/hooks/use-order";
import Skeleton from "@/src/components/ui/skeleton";
import PushPrompt from "@/src/components/push/push-prompt";
import SuccessHero from "./components/success-hero";
import ProtectionStrip from "./components/protection-strip";
import WhatNext from "./components/what-next";
import OrderSummaryCard from "./components/order-summary-card";
import NextActions from "./components/next-actions";
import GiftNotice from "../orders/[id]/components/gift-notice";
import SoldOutNotice from "../orders/[id]/components/sold-out-notice";

function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <Skeleton className="h-72 w-full rounded-[28px]" />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Skeleton className="h-96 w-full rounded-[24px]" />
        <Skeleton className="h-96 w-full rounded-[24px]" />
      </div>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) return <Loading />;

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted">
          <PackageSearch size={24} />
        </span>
        <p className="mt-4 text-[16px] font-semibold text-ink">We couldn&apos;t find that order</p>
        <p className="mt-1 text-[13.5px] text-muted">If you just paid, it&apos;s in your orders.</p>
        <Link href="/marketplace/orders" className="mt-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[13.5px] font-semibold text-white">
          Go to my orders
        </Link>
      </div>
    );
  }

  // Not a success after all: sold out just before the payment landed, or the
  // payment hasn't been confirmed yet. No confetti for those.
  if (order.status === "CANCELLED" || order.status === "PENDING") {
    return (
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-8 sm:px-6">
        {order.status === "CANCELLED" ? (
          <SoldOutNotice order={order} />
        ) : (
          <section className="flex items-start gap-3.5 rounded-[20px] border border-line bg-surface p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-muted">
              <Clock3 size={19} />
            </span>
            <div className="text-[13.5px] leading-relaxed">
              <p className="font-semibold text-ink">We&apos;re still confirming your payment</p>
              <p className="text-muted">This usually takes a moment. Your order page updates as soon as it&apos;s confirmed.</p>
            </div>
          </section>
        )}
        <NextActions orderId={order.id} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <SuccessHero order={order} />

      {order.gift && <GiftNotice order={order} />}

      {/* minmax(0, ...) + min-w-0: long one-line text (a delivery zone name)
          must not stretch the columns wider than a phone screen. */}
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          {!order.gift && <WhatNext order={order} />}
          {order.gift && <OrderSummaryCard order={order} />}
        </div>
        <div className="min-w-0 space-y-5">
          {!order.gift && <OrderSummaryCard order={order} />}
          <ProtectionStrip />
        </div>
      </div>

      <PushPrompt />
      <NextActions orderId={order.id} />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
