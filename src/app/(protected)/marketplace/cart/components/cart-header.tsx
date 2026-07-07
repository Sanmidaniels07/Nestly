"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

interface Props {
  itemsCount: number;
  onClearCart: () => void;
}

export default function CartHeader({ itemsCount, onClearCart }: Props) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#ECE9F6] bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] italic text-[#13131A]">
          Shopping cart
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#64748B]">
          {itemsCount} item{itemsCount !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="flex gap-2.5">
        <Link
          href="/marketplace/products"
          className="flex h-12 items-center gap-2 rounded-xl border border-[#ECE9F6] px-4 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]"
        >
          <ArrowLeft size={15} />
          Continue shopping
        </Link>

        <button
          onClick={onClearCart}
          className="flex h-12 items-center gap-2 rounded-xl border border-red-200 px-4 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 size={15} />
          Clear cart
        </button>
      </div>
    </div>
  );
}