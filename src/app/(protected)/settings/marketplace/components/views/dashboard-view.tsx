"use client";

import DashboardStats from "../seller-dashboard/dashboard-stat";
import InventorySnapshot from "../seller-dashboard/inventory-snapshot";
import OnboardingBanner from "../seller-dashboard/onboarding-banner";
import QuickActions from "../seller-dashboard/quick-actions";
import RecentOrders from "../seller-dashboard/recent-orders";
import SalesOverview from "../seller-dashboard/sales-overview";
import TopSellingProducts from "../seller-dashboard/top-selling-products";


interface Props {
  hasStore: boolean;
}

export default function DashboardView({
  hasStore,
}: Props) {
  if (!hasStore) {
    return <OnboardingBanner />;
  }

  return (
    <>
      <DashboardStats />

      <QuickActions />

      <InventorySnapshot />

      <RecentOrders />

      <SalesOverview />

      <TopSellingProducts />
    </>
  );
}