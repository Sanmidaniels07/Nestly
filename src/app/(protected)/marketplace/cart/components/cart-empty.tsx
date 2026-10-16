"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartEmpty() {
  return (
    <section className="rounded-2xl border border-dashed border-line-strong bg-surface px-10 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
        <ShoppingBag size={28} className="text-violet-700 dark:text-violet-300" />
      </div>

      <h2 className="mt-6 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
        Your cart is empty
      </h2>

      <p className="mt-2.5 text-[13.5px] text-muted">
        Looks like you haven&apos;t added anything yet.
      </p>

      <Link
        href="/marketplace"
        className="mt-7 inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[13px] font-semibold text-white transition-all hover:brightness-110"
      >
        Start shopping
      </Link>
    </section>
  );
}