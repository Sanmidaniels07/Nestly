"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import RecentOrderRow from "./recent-order-row";
import { sellerOrders } from "@/src/mocks/seller-order";

export default function RecentOrders() {
  const orders = sellerOrders.slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Orders
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
            Recent orders
          </h2>
        </div>

        <Link
          href="/settings/marketplace/orders"
          className="group flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-violet-600 hover:underline"
        >
          View all
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList size={28} className="text-[#C4C0DC]" strokeWidth={1.5} />
            <p className="mt-3 text-[13.5px] font-medium text-[#13131A]">No orders yet</p>
            <p className="mt-1 text-[12.5px] text-[#94A3B8]">
              Orders from customers will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#FBFAFE]">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Order
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Total
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
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