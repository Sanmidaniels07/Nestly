"use client";

import Link from "next/link";
import { Package } from "lucide-react";

export default function OrdersButton() {
  return (
    <Link
      href="/marketplace/orders"
      aria-label="My orders"
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ECE9F6] bg-white text-[#475569] transition-colors hover:border-violet-300 hover:bg-[#F8F7FC]"
    >
      <Package size={19} />
    </Link>
  );
}
