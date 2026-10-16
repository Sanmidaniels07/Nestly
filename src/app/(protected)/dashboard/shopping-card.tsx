"use client";

import Link from "next/link";
import { ChevronRight, Heart, Package, ShoppingCart, Wallet } from "lucide-react";

import { UserDashboard } from "@/src/types/user-dashboard";
import { formatCount, formatNaira } from "./format";

interface Props {
  shopping: UserDashboard["shopping"];
}

export default function ShoppingCard({ shopping }: Props) {
  const rows = [
    {
      icon: Package,
      label: "Orders in progress",
      value: formatCount(shopping.activeOrders),
      sub: `${formatCount(shopping.totalOrders)} total`,
      href: "/marketplace/orders",
      tint: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    },
    {
      icon: ShoppingCart,
      label: "In your cart",
      value: formatCount(shopping.cartItems),
      sub: shopping.cartItems > 0 ? "Ready to check out" : "Cart is empty",
      href: "/marketplace/cart",
      tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      icon: Heart,
      label: "Saved items",
      value: formatCount(shopping.wishlistCount),
      sub: "On your wishlist",
      href: "/marketplace/saved",
      tint: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    },
    {
      icon: Wallet,
      label: "Total spent",
      value: formatNaira(shopping.totalSpent),
      sub: "Across paid orders",
      href: "/marketplace/orders",
      tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
  ];

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">Shopping</h2>
        <Link href="/marketplace" className="text-[12.5px] font-semibold text-violet-600 hover:underline dark:text-violet-400">
          Marketplace
        </Link>
      </div>

      <div className="mt-4 space-y-1">
        {rows.map((row) => (
          <Link
            key={row.label}
            href={row.href}
            className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface-2"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${row.tint}`}>
              <row.icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium text-ink">{row.label}</p>
              <p className="truncate text-[12px] text-subtle">{row.sub}</p>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-ink">{row.value}</span>
            <ChevronRight size={15} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
