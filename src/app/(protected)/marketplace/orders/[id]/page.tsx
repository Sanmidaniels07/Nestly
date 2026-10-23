"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { useOrder } from "@/src/hooks/use-order";
import OrderHeader from "./components/order-header";
import ShippingAddress from "./components/shipping-address";
import PaymentDetails from "./components/payment-details";
import OrderSummary from "./components/order-summary";
import OrderActions from "./components/order-actions";
import OrderTimeline from "./components/order-timeline";
import OrderedProducts from "./components/ordered-products";
import DeliveryCodes from "./components/delivery-codes";
import SupportCard from "./components/support-card";
import SellerNotesCard from "./components/seller-notes-card";
import Skeleton from "@/src/components/ui/skeleton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: Props) {
  const { id } = use(params);
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-5 sm:py-8">
        <Skeleton className="h-8 w-56" />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
          <section className="min-w-0 space-y-5">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </section>

          <aside className="min-w-0 space-y-5">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </aside>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-5 sm:py-8">
      <OrderHeader order={order} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
        <section className="min-w-0 space-y-5">
          <DeliveryCodes order={order} />
          <OrderedProducts order={order} />
          <SellerNotesCard order={order} />

          {order.address && <ShippingAddress address={order.address} />}
          {order.timeline && order.timeline.length > 0 && <OrderTimeline order={order} />}
        </section>

        <aside className="min-w-0 space-y-5">
          <PaymentDetails order={order} />
          <OrderSummary order={order} />
          <OrderActions order={order} />
          <SupportCard orderId={order.id} />
        </aside>
      </div>
    </div>
  );
}
