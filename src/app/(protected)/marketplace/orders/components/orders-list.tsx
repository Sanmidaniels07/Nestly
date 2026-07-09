"use client";

import { MarketplaceOrder } from "@/src/mocks/order";
import EmptyOrders from "./empty-orders";
import OrderCard from "./order-card";

interface Props {
  orders: MarketplaceOrder[];
}

export default function OrdersList({ orders }: Props) {
  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <section className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </section>
  );
}