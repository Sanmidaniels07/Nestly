"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function ProductsHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
          Catalog
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[34px] italic text-[#13131A] sm:text-[40px]">
          Products
        </h1>
      </div>

      <Link
        href="/settings/marketplace/components/products/new"
        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
      >
        <Plus size={16} />
        Add product
      </Link>
    </section>
  );
}