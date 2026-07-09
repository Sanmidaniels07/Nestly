"use client";

import { useState } from "react";

import SellerDashboardHeader from "./components/seller-dashboard/seller-dashboard-header";
import MarketplaceTabs, { Tab } from "./components/marketplace-tabs";
import DashboardView from "./components/views/dashboard-view";
import ProductsView from "./components/views/product-view";

export default function MarketplaceSettingsPage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  const hasStore = false;

  const tabViews: Partial<Record<Tab, React.ReactNode>> = {
    dashboard: <DashboardView hasStore={hasStore} />,
    products: <ProductsView />,
    // orders: <OrdersView />,
    // customers: <CustomersView />,
    // analytics: <AnalyticsView />,
    // store: <StoreView />,
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