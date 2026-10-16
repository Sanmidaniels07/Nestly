"use client";

import Link from "next/link";
import { Package } from "lucide-react";

export default function OrdersButton() {
  return (
    <Link
      href="/marketplace/orders"
      aria-label="My orders"
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink-3 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40 hover:bg-surface-sunken"
    >
      <Package size={19} />
    </Link>
  );
}
