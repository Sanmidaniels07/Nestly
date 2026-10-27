"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Store,
  RotateCcw,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Link2,
} from "lucide-react";

export type Tab = "dashboard" | "products" | "links" | "orders" | "customers" | "returns" | "analytics" | "earnings" | "store";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "links", label: "Payment links", icon: Link2 },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "customers", label: "Customers", icon: Users },
  { id: "returns", label: "Returns", icon: RotateCcw },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "store", label: "Store settings", icon: Store },
];

export default function MarketplaceTabs({ active, onChange }: Props) {
  const stripRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Arrows only appear when tabs are hidden off that side - a mouse can't
  // swipe the strip the way a finger can.
  const measure = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    setCanLeft(strip.scrollLeft > 4);
    setCanRight(strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 4);
  }, []);

  useEffect(() => {
    measure();
    const strip = stripRef.current;
    if (!strip) return;
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [measure]);

  // Keep the active tab in view when arriving via a link (e.g. ?tab=store)
  // or the back button.
  useEffect(() => {
    const strip = stripRef.current;
    const tab = activeRef.current;
    if (!strip || !tab) return;
    const left = tab.offsetLeft;
    if (left < strip.scrollLeft || left + tab.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: Math.max(0, left - 48), behavior: "smooth" });
    }
  }, [active]);

  const scrollBy = (direction: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollBy({ left: direction * Math.max(200, strip.clientWidth * 0.6), behavior: "smooth" });
  };

  return (
    <section className="relative">
      <div ref={stripRef} onScroll={measure} className="relative overflow-x-auto scrollbar-hide rounded-xl">
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
      </div>

      {canLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-16 items-center bg-gradient-to-r from-canvas via-canvas/80 to-transparent">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Show earlier tabs"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-sm transition-colors hover:text-violet-700 dark:hover:text-violet-300"
          >
            <ChevronLeft size={17} />
          </button>
        </div>
      )}

      {canRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-16 items-center justify-end bg-gradient-to-l from-canvas via-canvas/80 to-transparent">
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Show more tabs"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-sm transition-colors hover:text-violet-700 dark:hover:text-violet-300"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}
