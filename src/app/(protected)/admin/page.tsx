"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Package, ShieldAlert, Store, Ticket, Users, Wallet } from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import ReportsQueue from "./reports-queue";
import CouponsManager from "./coupons-manager";
import PayoutsManager from "./payouts-manager";
import CategoriesManager from "./categories-manager";
import UsersManager from "./users-manager";
import SellersManager from "./sellers-manager";
import ProductsManager from "./products-manager";

type Tab = "reports" | "users" | "sellers" | "products" | "coupons" | "payouts" | "categories";

const VALID_TABS: Tab[] = ["reports", "users", "sellers", "products", "coupons", "payouts", "categories"];

const tabs: { id: Tab; label: string; icon: typeof ShieldAlert }[] = [
  { id: "reports", label: "Reports", icon: ShieldAlert },
  { id: "users", label: "Users", icon: Users },
  { id: "sellers", label: "Sellers", icon: Store },
  { id: "products", label: "Products", icon: Package },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "categories", label: "Categories", icon: LayoutGrid },
];

function AdminPageContent() {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(urlTab && VALID_TABS.includes(urlTab) ? urlTab : "reports");
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (urlTab && VALID_TABS.includes(urlTab)) setTab(urlTab);
  }, [urlTab]);

  if (role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p className="text-[15px] font-medium text-ink">Not authorized</p>
        <p className="mt-1 text-[13.5px] text-muted">
          This area is only available to admins.
        </p>
      </div>
    );
  }

  const tabViews: Record<Tab, React.ReactNode> = {
    reports: <ReportsQueue />,
    users: <UsersManager />,
    sellers: <SellersManager />,
    products: <ProductsManager />,
    coupons: <CouponsManager />,
    payouts: <PayoutsManager />,
    categories: <CategoriesManager />,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
          Admin
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[36px] italic leading-none text-ink">
          Moderation
        </h1>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex gap-0.5 rounded-xl bg-surface-2 p-1">
          {tabs.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-[13.5px] font-medium transition-all ${
                  isActive ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300" : "text-muted hover:text-ink"
                }`}
              >
                <t.icon size={15} className={isActive ? "text-violet-600 dark:text-violet-400" : "text-subtle"} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {tabViews[tab]}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminPageContent />
    </Suspense>
  );
}
