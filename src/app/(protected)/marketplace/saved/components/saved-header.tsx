"use client";

import { Heart } from "lucide-react";

interface Props {
  count?: number;
}

export default function SavedHeader({ count }: Props) {
  return (
    <section>
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
          <Heart size={20} className="fill-red-500 text-red-500" />
        </div>
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Wishlist
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[34px] italic text-[#13131A] sm:text-[40px]">
            Saved products
          </h1>
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[#64748B]">
        Keep track of products you love and purchase them whenever you're ready.
        {typeof count === "number" && count > 0 && (
          <span className="font-[family-name:var(--font-mono)] text-[#94A3B8]"> ({count} saved)</span>
        )}
      </p>
    </section>
  );
}