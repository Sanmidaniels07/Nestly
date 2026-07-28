"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function NextActions() {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/marketplace/orders"
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
      >
        View orders
      </Link>

      <Link
        href="/marketplace"
        className="flex items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] py-3.5 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]"
      >
        <ShoppingBag size={16} />
        Continue shopping
      </Link>
    </section>
  );
}
