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
      <div className="mx-auto max-w-7xl px-5 py-16 text-center text-[14px] text-[#94A3B8]">
        Loading order...
      </div>
    );
  }

  if (isError || !order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <OrderHeader order={order} />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_420px]">
        <section className="space-y-5">
          <OrderedProducts order={order} />

          {order.address && <ShippingAddress address={order.address} />}
          {order.timeline && order.timeline.length > 0 && <OrderTimeline order={order} />}
        </section>

        <aside className="space-y-5">
          <PaymentDetails order={order} />
          <OrderSummary order={order} />
          <OrderActions order={order} />
        </aside>
      </div>
    </div>
  );
}
