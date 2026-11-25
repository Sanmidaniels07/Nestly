"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  ClipboardList,
  House,
  Link2,
  LayoutDashboard,
  Package,
  Radio,
  RotateCcw,
  Store,
  Users,
  Wallet,
} from "lucide-react";

// The page's ?tab= values. They stay as they were so every existing link
// (emails, notifications, buttons) still opens the right place.
export type Tab = "dashboard" | "products" | "lives" | "links" | "orders" | "customers" | "returns" | "analytics" | "earnings" | "store";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

type Icon = typeof LayoutDashboard;

// Five sections instead of ten tabs; the rest sit as small choices inside
// the section they belong to.
const SECTIONS: { id: string; label: string; icon: Icon; tabs: { id: Tab; label: string; icon: Icon }[] }[] = [
  {
    id: "home",
    label: "Home",
    icon: House,
    tabs: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard },
      { id: "analytics", label: "Insights", icon: BarChart3 },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    tabs: [
      { id: "products", label: "Products", icon: Package },
      { id: "lives", label: "Go live", icon: Radio },
      { id: "links", label: "Pay links", icon: Link2 },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: ClipboardList,
    tabs: [
      { id: "orders", label: "Orders", icon: ClipboardList },
      { id: "returns", label: "Returns", icon: RotateCcw },
      { id: "customers", label: "Customers", icon: Users },
    ],
  },
  { id: "money", label: "Money", icon: Wallet, tabs: [{ id: "earnings", label: "Earnings", icon: Wallet }] },
  { id: "store", label: "Store", icon: Store, tabs: [{ id: "store", label: "Store settings", icon: Store }] },
];

export const sectionOf = (tab: Tab) => SECTIONS.find((section) => section.tabs.some((item) => item.id === tab)) ?? SECTIONS[0];

export default function MarketplaceTabs({ active, onChange }: Props) {
  const current = sectionOf(active);

  return (
    <nav aria-label="Seller Hub" className="space-y-3">
      {/* Five fixed places - no sideways scrolling, even on a small phone. */}
      <div className="grid grid-cols-5 gap-1 rounded-2xl border border-line bg-surface p-1 shadow-sm">
        {SECTIONS.map((section) => {
          const isActive = section.id === current.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.tabs[0].id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11.5px] font-semibold transition-colors sm:flex-row sm:gap-2 sm:py-2.5 sm:text-[13.5px] ${
                isActive ? "text-white" : "text-muted hover:text-ink"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="seller-hub-section"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_8px_20px_-10px_rgba(91,33,182,0.7)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <section.icon size={18} className="relative shrink-0" />
              <span className="relative truncate">{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* The choices inside this section, when it has more than one. */}
      {current.tabs.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={current.label}>
          {current.tabs.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(item.id)}
                className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "bg-violet-100 text-violet-800 ring-1 ring-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:ring-violet-500/40"
                    : "border border-line bg-surface text-muted hover:border-violet-200 hover:text-ink dark:hover:border-violet-500/30"
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
