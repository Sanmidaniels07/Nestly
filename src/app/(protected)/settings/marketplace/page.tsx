"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useMySeller } from "@/src/hooks/use-my-seller";
import SellerDashboardHeader from "./components/seller-dashboard/seller-dashboard-header";
import MarketplaceTabs, { Tab } from "./components/marketplace-tabs";
import DashboardView from "./components/views/dashboard-view";
import ProductsView from "./components/views/product-view";
import OrdersView from "./components/views/orders-view";
import CustomersView from "./components/views/customers-view";
import StoreView from "./components/views/store-view";
import ReturnsView from "./components/views/returns-view";
import AnalyticsView from "./components/views/analytics-view";
import EarningsView from "./components/views/earnings-view";
import Skeleton from "@/src/components/ui/skeleton";
import { StatTilesSkeleton } from "@/src/components/skeletons/stat-tiles-skeleton";

const VALID_TABS: Tab[] = [
  "dashboard",
  "products",
  "orders",
  "customers",
  "returns",
  "analytics",
  "earnings",
  "store",
];

function MarketplaceSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(urlTab && VALID_TABS.includes(urlTab) ? urlTab : "dashboard");

  useEffect(() => {
    if (urlTab && VALID_TABS.includes(urlTab)) setTab(urlTab);
  }, [urlTab]);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    router.replace(next === "dashboard" ? "/settings/marketplace" : `/settings/marketplace?tab=${next}`);
  };

  const { data: seller, isLoading } = useMySeller();
  const hasStore = !!seller?.store;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="h-11 w-full max-w-md rounded-xl" />
        <StatTilesSkeleton count={4} />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  const tabViews: Partial<Record<Tab, React.ReactNode>> = {
    dashboard: <DashboardView hasStore={hasStore} />,
    products: <ProductsView />,
    orders: <OrdersView />,
    customers: <CustomersView />,
    returns: <ReturnsView />,
    analytics: <AnalyticsView />,
    earnings: <EarningsView />,
    store: <StoreView />,
  };

  return (
    <div className="space-y-8">
      <SellerDashboardHeader />

      <MarketplaceTabs active={tab} onChange={handleTabChange} />

      {tabViews[tab] ?? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <p className="text-[13.5px] text-[#94A3B8]">This section is coming soon.</p>
        </div>
      )}
    </div>
  );
}

export default function MarketplaceSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-8 w-56" />
          <StatTilesSkeleton count={4} />
        </div>
      }
    >
      <MarketplaceSettingsContent />
    </Suspense>
  );
}
