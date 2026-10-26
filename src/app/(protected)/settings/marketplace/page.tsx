"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, XCircle } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import SellerDashboardHeader from "./components/seller-dashboard/seller-dashboard-header";
import SuspendedStoreBanner from "./components/seller-dashboard/suspended-store-banner";
import CacReminderBanner from "./components/seller-dashboard/cac-reminder-banner";
import MarketplaceTabs, { Tab } from "./components/marketplace-tabs";
import DashboardView from "./components/views/dashboard-view";
import ProductsView from "./components/views/product-view";
import OrdersView from "./components/views/orders-view";
import CustomersView from "./components/views/customers-view";
import StoreView from "./components/views/store-view";
import ReturnsView from "./components/views/returns-view";
import AnalyticsView from "./components/views/analytics-view";
import EarningsView from "./components/views/earnings-view";
import SetupStorePrompt from "./components/seller-dashboard/setup-store-prompt";
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
  // The URL is the single source of truth for the active tab, so the browser /
  // phone back button steps through previously visited tabs, and links like
  // ?tab=products from a detail page land on the right one.
  const urlTab = searchParams.get("tab") as Tab | null;
  const tab: Tab = urlTab && VALID_TABS.includes(urlTab) ? urlTab : "dashboard";

  const handleTabChange = (next: Tab) => {
    if (next === tab) return;
    router.push(
      next === "dashboard" ? "/settings/marketplace" : `/settings/marketplace?tab=${next}`,
      { scroll: false }
    );
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

  if (seller && seller.status !== "APPROVED") {
    const isPending = seller.status === "PENDING";
    return (
      <div className="mx-auto max-w-3xl space-y-8 pb-20 pt-6">
        <SellerDashboardHeader />
        <section className="rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-10">
          <div
            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
              isPending ? "bg-amber-50 dark:bg-amber-500/10" : "bg-red-50 dark:bg-red-500/10"
            }`}
          >
            {isPending ? (
              <Clock size={26} className="text-amber-600 dark:text-amber-400" />
            ) : (
              <XCircle size={26} className="text-red-600 dark:text-red-400" />
            )}
          </div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
            {isPending ? "Application pending" : "Application rejected"}
          </h1>
          <p className="mt-2.5 text-[13.5px] text-muted">
            {isPending
              ? "Your seller application is awaiting admin review. Your dashboard will unlock once it's approved."
              : seller.statusReason
                ? `Reason: ${seller.statusReason}`
                : "Your seller application was not approved, so your store is no longer manageable."}
          </p>
          <Link
            href="/marketplace/sell"
            className="mt-7 inline-block text-[13px] font-medium text-violet-700 dark:text-violet-300 hover:underline"
          >
            View application status
          </Link>
        </section>
      </div>
    );
  }

  const tabSections: Record<Tab, string> = {
    dashboard: "dashboard",
    products: "products",
    orders: "orders",
    customers: "customers",
    returns: "return requests",
    analytics: "analytics",
    earnings: "earnings",
    store: "store settings",
  };

  const tabViews: Partial<Record<Tab, React.ReactNode>> = {
    dashboard: <DashboardView seller={seller} />,
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

      {seller?.store?.isSuspended && <SuspendedStoreBanner />}

      {/* Every approved seller without a CAC number, store or not. */}
      {seller?.status === "APPROVED" && !seller.cacNumber && <CacReminderBanner />}

      <MarketplaceTabs active={tab} onChange={handleTabChange} />

      <div className="overflow-x-auto">
        {tab !== "dashboard" && !hasStore ? (
          <SetupStorePrompt section={tabSections[tab]} isSeller={!!seller} />
        ) : tabViews[tab] ?? (
          <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
            <p className="text-[13.5px] text-subtle">This section is coming soon.</p>
          </div>
        )}
      </div>
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
