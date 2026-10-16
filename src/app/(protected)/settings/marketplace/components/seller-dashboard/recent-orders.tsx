"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import RecentOrderRow from "./recent-order-row";
import { useSellerRecentOrders } from "@/src/hooks/use-seller-recent-orders";

export default function RecentOrders() {
  const { data, isLoading } = useSellerRecentOrders(5);
  const orders = data ?? [];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Orders
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
            Recent orders
          </h2>
        </div>

        <Link
          href="/settings/marketplace?tab=orders"
          className="group flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          View all
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {isLoading ? (
          <div className="h-40 animate-pulse bg-surface-2" />
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList size={28} className="text-faint" strokeWidth={1.5} />
            <p className="mt-3 text-[13.5px] font-medium text-ink">No orders yet</p>
            <p className="mt-1 text-[12.5px] text-subtle">
              Orders from customers will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-surface-sunken">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Order
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Total
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Date
                  </th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <RecentOrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}