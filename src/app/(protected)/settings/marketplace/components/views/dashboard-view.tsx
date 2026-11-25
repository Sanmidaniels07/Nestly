"use client";

import { SellerProfile } from "@/src/types/seller";
import DashboardStats from "../seller-dashboard/dashboard-stat";
import OnboardingBanner from "../seller-dashboard/onboarding-banner";
import QuickActions from "../seller-dashboard/quick-actions";
import RecentOrders from "../seller-dashboard/recent-orders";
import SetupChecklist from "../seller-dashboard/setup-checklist";
import ShareStoreCard from "../seller-dashboard/share-store-card";
import TrustBadgeCard from "../seller-dashboard/trust-badge-card";
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

  // Today at a glance: numbers, quick actions, the latest orders, then ways
  // to bring buyers in. Charts and stock live under Insights. What to set up
  // next is the card above the tabs.
  return (
    <div className="space-y-8 sm:space-y-10">
      <DashboardStats />

      <QuickActions />

      <RecentOrders />

      <ShareStoreCard />
      <TrustBadgeCard />

      <KeepSalesOnNestly />
    </div>
  );
}
