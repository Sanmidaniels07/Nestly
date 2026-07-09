"use client";

import SuccessHero from "./components/success-hero";
import OrderSummaryCard from "./components/order-summary-card";
import DeliveryTimeline from "./components/delivery-timeline";
import NextActions from "./components/next-actions";
import { orders } from "@/src/mocks/order";

const latestOrder = orders[0];

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <SuccessHero orderNumber={latestOrder.orderNumber} />
      <OrderSummaryCard />
      <DeliveryTimeline status="confirmed" />
      <NextActions orderNumber={latestOrder.orderNumber} />
    </div>
  );
}