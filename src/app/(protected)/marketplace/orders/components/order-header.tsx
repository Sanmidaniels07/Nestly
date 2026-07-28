"use client";

import Link from "next/link";
import { Package, RotateCcw } from "lucide-react";

export default function OrdersHeader() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
          <Package size={20} className="text-white" />
        </div>

        <div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[30px] italic text-[#13131A] sm:text-[34px]">
            My orders
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[#64748B]">
            View and manage your purchases.
          </p>
        </div>
      </div>

      <Link
        href="/marketplace/returns"
        className="flex items-center gap-1.5 rounded-xl border border-[#ECE9F6] px-4 py-2.5 text-[13px] font-semibold text-[#334155] transition-colors hover:border-violet-300 hover:text-violet-600"
      >
        <RotateCcw size={14} />
        My returns
      </Link>
    </section>
  );
}