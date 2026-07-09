"use client";

import { PackagePlus, Boxes, ShoppingBag, Store, BarChart3, Wallet } from "lucide-react";
import ActionCard from "./action-card";

const actions = [
  {
    title: "Add product",
    description: "Create a new product listing.",
    href: "/settings/marketplace/products/new",
    icon: PackagePlus,
    color: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    title: "Products",
    description: "Manage inventory and pricing.",
    href: "/settings/marketplace/products",
    icon: Boxes,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    title: "Orders",
    description: "View and fulfil customer orders.",
    href: "/settings/marketplace/orders",
    icon: ShoppingBag,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Store settings",
    description: "Update store profile and policies.",
    href: "/settings/marketplace/store",
    icon: Store,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    title: "Analytics",
    description: "Track growth and sales.",
    href: "/settings/marketplace/analytics",
    icon: BarChart3,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Earnings",
    description: "Monitor payouts and revenue.",
    href: "/settings/marketplace/earnings",
    icon: Wallet,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

export default function QuickActions() {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
          Quick actions
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          Manage your business
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}