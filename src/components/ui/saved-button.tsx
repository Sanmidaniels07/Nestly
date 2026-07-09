"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useSavedStore } from "@/src/store/saved-store";

export default function SavedButton() {
  const count = useSavedStore((state) => state.items.length);

  return (
    <Link
      href="/marketplace/saved"
      aria-label="Saved products"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F7F7FB] hover:text-red-500"
    >
      <Heart size={19} className={count > 0 ? "fill-red-500 text-red-500" : ""} />

      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-white ring-2 ring-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}