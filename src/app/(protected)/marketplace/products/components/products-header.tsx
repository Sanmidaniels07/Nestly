"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default function ProductsHeader() {
  return (
    <section className="space-y-4">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-violet-600 dark:text-violet-400 hover:underline"
      >
        <ArrowLeft size={15} />
        Back to marketplace
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Marketplace
          </p>
          <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[36px] italic text-ink sm:text-[42px]">
            Browse products
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-muted">
            Discover thousands of products from verified sellers around your location.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
            <MapPin size={16} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-[11px] text-subtle">Showing products near</p>
            <h3 className="text-[13.5px] font-semibold text-ink">Lagos, Nigeria</h3>
          </div>
        </div>
      </div>
    </section>
  );
}