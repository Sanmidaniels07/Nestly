"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function NextActions({ orderId }: { orderId: string }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Link
        href={`/marketplace/orders/${orderId}`}
        className="group flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(109,40,217,0.8)] transition-all hover:brightness-110"
      >
        Track my order
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </Link>

      <Link
        href="/marketplace"
        className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3.5 text-[14px] font-semibold text-ink-2 transition-colors hover:bg-surface-sunken"
      >
        <ShoppingBag size={16} />
        Keep shopping
      </Link>
    </section>
  );
}
