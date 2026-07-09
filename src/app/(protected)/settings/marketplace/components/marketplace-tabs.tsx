"use client";

import { LayoutDashboard, Package, ClipboardList, Users, BarChart3, Store } from "lucide-react";

export type Tab = "dashboard" | "products" | "orders" | "customers" | "analytics" | "store";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "store", label: "Store settings", icon: Store },
];

export default function MarketplaceTabs({ active, onChange }: Props) {
  return (
    <section className="overflow-x-auto scrollbar-hide">
      <div className="inline-flex gap-0.5 rounded-xl bg-[#F7F7FB] p-1">
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-[13.5px] font-medium transition-all ${
                isActive
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-[#64748B] hover:text-[#13131A]"
              }`}
            >
              <tab.icon size={15} className={isActive ? "text-violet-600" : "text-[#94A3B8]"} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}