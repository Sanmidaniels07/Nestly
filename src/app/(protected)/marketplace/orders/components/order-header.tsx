"use client";

import { Package } from "lucide-react";

export default function OrdersHeader() {
  return (
    <section className="flex items-center gap-3.5">
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
    </section>
  );
}