"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import OrderHeader from "./components/order-header";
import OrderProgress from "./components/order-progress";
import ShippingAddress from "./components/shipping-address";
import PaymentDetails from "./components/payment-details";
import OrderSummary from "./components/order-summary";
import OrderActions from "./components/order-actions";
import SupportCard from "./components/support-card";
import { getOrderById } from "@/src/mocks/order";
import OrderTimeline from "./components/order-timeline";
import OrderedProducts from "./components/ordered-products";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: Props) {
  const { id } = use(params);
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <OrderHeader order={order} />
      <OrderProgress order={order} />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_420px]">
        <section className="space-y-5">
          <OrderedProducts order={order} />

          <ShippingAddress order={order} />
          <OrderTimeline order={order} />
        </section>

        <aside className="space-y-5">
          <PaymentDetails order={order} />
          <OrderSummary order={order} />
          <OrderActions order={order} />
          <SupportCard />
        </aside>
      </div>
    </div>
  );
}
