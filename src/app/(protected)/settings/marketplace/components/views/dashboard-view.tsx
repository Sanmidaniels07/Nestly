"use client";

import { SellerProfile } from "@/src/types/seller";
import DashboardStats from "../seller-dashboard/dashboard-stat";
import InventorySnapshot from "../seller-dashboard/inventory-snapshot";
import OnboardingBanner from "../seller-dashboard/onboarding-banner";
import QuickActions from "../seller-dashboard/quick-actions";
import RecentOrders from "../seller-dashboard/recent-orders";
import SalesOverview from "../seller-dashboard/sales-overview";
import SetupChecklist from "../seller-dashboard/setup-checklist";
import TopSellingProducts from "../seller-dashboard/top-selling-products";
import ShareStoreCard from "../seller-dashboard/share-store-card";
import KeepSalesOnNestly from "../seller-dashboard/keep-sales-on-nestly";

interface Props {
  seller?: SellerProfile;
}

export default function DashboardView({ seller }: Props) {
  // Not a seller yet - pitch selling on Nestly.
  if (!seller) {
    return <OnboardingBanner />;
  }

  // Approved but no store yet - show what's left rather than the pitch.
  if (!seller.store) {
    return <SetupChecklist seller={seller} />;
  }

  // The tab wrapper adds no spacing, so the gap between sections lives here.
  return (
    <div className="space-y-10 sm:space-y-12">
      <SetupChecklist seller={seller} />

      <DashboardStats />

      <QuickActions />

      <ShareStoreCard />

      <KeepSalesOnNestly />

      <InventorySnapshot />

      <RecentOrders />

      <SalesOverview />

      <TopSellingProducts />
    </div>
  );
}
