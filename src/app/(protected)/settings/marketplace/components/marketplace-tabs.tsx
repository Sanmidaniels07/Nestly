"use client";

import { useEffect, useRef } from "react";
import { LayoutDashboard, Package, ClipboardList, Users, BarChart3, Store, RotateCcw, Wallet } from "lucide-react";

export type Tab = "dashboard" | "products" | "orders" | "customers" | "returns" | "analytics" | "earnings" | "store";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "customers", label: "Customers", icon: Users },
  { id: "returns", label: "Returns", icon: RotateCcw },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "store", label: "Store settings", icon: Store },
];

export default function MarketplaceTabs({ active, onChange }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null);

  // On mobile the strip scrolls sideways - keep the active tab in view when
  // arriving via a link (e.g. ?tab=store) or the back button.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <section className="overflow-x-auto scrollbar-hide">
      <div className="inline-flex gap-0.5 rounded-xl bg-surface-2 p-1">
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-[13.5px] font-medium transition-all ${
                isActive
                  ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300"
                  : "text-muted hover:text-ink"
              }`}
            >
              <tab.icon size={15} className={isActive ? "text-violet-600 dark:text-violet-400" : "text-subtle"} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}