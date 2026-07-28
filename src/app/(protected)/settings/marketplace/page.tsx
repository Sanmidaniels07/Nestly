"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useMySeller } from "@/src/hooks/use-my-seller";
import SellerDashboardHeader from "./components/seller-dashboard/seller-dashboard-header";
import MarketplaceTabs, { Tab } from "./components/marketplace-tabs";
import DashboardView from "./components/views/dashboard-view";
import ProductsView from "./components/views/product-view";
import OrdersView from "./components/views/orders-view";
import CustomersView from "./components/views/customers-view";
import StoreView from "./components/views/store-view";
import ReturnsView from "./components/views/returns-view";

function MarketplaceSettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "dashboard";
  const [tab, setTab] = useState<Tab>(initialTab);

  const { data: seller, isLoading } = useMySeller();
  const hasStore = !!seller?.store;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white px-8 py-16 text-center text-[13.5px] text-[#94A3B8]">
        Loading...
      </div>
    );
  }

  const tabViews: Partial<Record<Tab, React.ReactNode>> = {
    dashboard: <DashboardView hasStore={hasStore} />,
    products: <ProductsView />,
    orders: <OrdersView />,
    customers: <CustomersView />,
    returns: <ReturnsView />,
    // analytics: <AnalyticsView />,
    store: <StoreView />,
  };

  return (
    <div className="space-y-8">
      <SellerDashboardHeader />

      <MarketplaceTabs active={tab} onChange={setTab} />

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
        <div className="rounded-2xl border border-[#ECE9F6] bg-white px-8 py-16 text-center text-[13.5px] text-[#94A3B8]">
          Loading...
        </div>
      }
    >
      <MarketplaceSettingsContent />
    </Suspense>
  );
}
