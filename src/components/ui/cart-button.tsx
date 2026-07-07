"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/src/store/cart-store";

export default function CartButton() {
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <Link
      href="/marketplace/cart"
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#ECE9F6] bg-white transition-colors hover:border-violet-300 hover:bg-[#F8F7FC]"
    >
      <ShoppingCart size={19} className="text-[#475569]" />

      {totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-1 text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}