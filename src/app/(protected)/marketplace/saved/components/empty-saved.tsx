"use client";

import Link from "next/link";
import { Heart, SearchX } from "lucide-react";

interface Props {
  variant?: "no-saved" | "no-results";
  query?: string;
}

export default function EmptySaved({ variant = "no-saved", query }: Props) {
  const isSearchMiss = variant === "no-results";

  return (
    <section className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-6 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          isSearchMiss ? "bg-[#F1F0F5]" : "bg-red-50"
        }`}
      >
        {isSearchMiss ? (
          <SearchX size={28} className="text-[#94A3B8]" strokeWidth={1.5} />
        ) : (
          <Heart size={28} className="text-red-500" strokeWidth={1.5} />
        )}
      </div>

      <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        {isSearchMiss ? `No results for "${query}"` : "No saved products"}
      </h2>

      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#64748B]">
        {isSearchMiss
          ? "Try a different search term, or clear the search to see all your saved products."
          : "Products you save will appear here so you can easily find them later."}
      </p>

      {!isSearchMiss && (
        <Link
          href="/marketplace/products"
          className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          Explore products
        </Link>
      )}
    </section>
  );
}