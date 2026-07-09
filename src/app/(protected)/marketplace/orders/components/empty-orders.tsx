"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyOrders() {
  return (
    <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
        <ShoppingBag size={28} className="text-violet-600" strokeWidth={1.5} />
      </div>

      <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        No orders yet
      </h2>

      <p className="mt-2 max-w-sm text-[14px] text-[#64748B]">
        You haven't placed any orders yet. Browse the marketplace and purchase your first item.
      </p>

      <Link
        href="/marketplace/products"
        className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
      >
        Browse products
      </Link>
    </section>
  );
}