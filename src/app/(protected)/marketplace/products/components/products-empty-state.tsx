"use client";

import { SearchX } from "lucide-react";

export default function ProductsEmpty() {
  return (
    <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 py-20">
      <SearchX size={40} className="text-[#C4C0DC]" strokeWidth={1.5} />
      <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        No products found
      </h2>
      <p className="mt-2 max-w-sm text-center text-[14px] text-[#64748B]">
        Try changing your search or removing some filters.
      </p>
    </section>
  );
}