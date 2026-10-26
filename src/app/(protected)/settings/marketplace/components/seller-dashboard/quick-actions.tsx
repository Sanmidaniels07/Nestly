"use client";

import Link from "next/link";
import { BookOpen, PackagePlus, Boxes, ShoppingBag, Store, BarChart3, Wallet } from "lucide-react";
import ActionCard from "./action-card";

const actions = [
  {
    title: "Add product",
    description: "Create a new product listing.",
    href: "/settings/marketplace/components/products/new",
    icon: PackagePlus,
    color: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Products",
    description: "Manage inventory and pricing.",
    href: "/settings/marketplace?tab=products",
    icon: Boxes,
    color: "bg-indigo-50 dark:bg-indigo-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Orders",
    description: "View and fulfil customer orders.",
    href: "/settings/marketplace?tab=orders",
    icon: ShoppingBag,
    color: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Store settings",
    description: "Update store profile and policies.",
    href: "/settings/marketplace?tab=store",
    icon: Store,
    color: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    title: "Analytics",
    description: "Track growth and sales.",
    href: "/settings/marketplace?tab=analytics",
    icon: BarChart3,
    color: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Earnings",
    description: "Monitor payouts and revenue.",
    href: "/settings/marketplace?tab=earnings",
    icon: Wallet,
    color: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function QuickActions() {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Quick actions
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
            Manage your business
          </h2>
          <Link href="/guides/sellers" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
            <BookOpen size={14} /> Seller guide
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}