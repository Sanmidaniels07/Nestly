"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, XCircle } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import SellerDashboardHeader from "./components/seller-dashboard/seller-dashboard-header";
import SuspendedStoreBanner from "./components/seller-dashboard/suspended-store-banner";
import UnderReviewBanner from "./components/seller-dashboard/under-review-banner";
import SellerNextStep from "./components/seller-dashboard/seller-next-step";
import MarketplaceTabs, { Tab } from "./components/marketplace-tabs";
import DashboardView from "./components/views/dashboard-view";
import ProductsView from "./components/views/product-view";
import PaymentLinksView from "./components/views/payment-links-view";
import LivesView from "./components/views/lives-view";
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
  "lives",
  "links",
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

  // Rejected with "stop new sales": no new orders, but the orders already
  // paid still have to be delivered - and they're paid for them as usual.
  if (seller && seller.status !== "APPROVED" && seller.store?.salesStoppedAt) {
    return <FinishOpenOrders reason={seller.statusReason} />;
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
          <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] text-ink">
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
    lives: "live selling",
    links: "payment links",
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
    lives: <LivesView />,
    links: <PaymentLinksView />,
    orders: <OrdersView />,
    customers: <CustomersView />,
    returns: <ReturnsView />,
    analytics: <AnalyticsView />,
    earnings: <EarningsView />,
    store: <StoreView />,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SellerDashboardHeader />

      {seller?.store?.isSuspended && <SuspendedStoreBanner />}
      {seller?.store?.underReview && !seller.store.isSuspended && <UnderReviewBanner orderLimit={seller.orderLimit} held={seller.heldForReview} />}

      {/* The one thing to do next (setup step, then the CAC number). */}
      <SellerNextStep seller={seller} />

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

const FINISH_TABS = [
  { key: "orders", label: "Orders" },
  { key: "returns", label: "Returns" },
  { key: "earnings", label: "Earnings" },
] as const;

// Seller Hub for a seller rejected with "stop new sales": only what they
// need to finish the orders buyers already paid for.
function FinishOpenOrders({ reason }: { reason?: string | null }) {
  const [tab, setTab] = useState<(typeof FINISH_TABS)[number]["key"]>("orders");

  return (
    <div className="space-y-6">
      <SellerDashboardHeader />
      <section className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10 sm:p-5">
        <XCircle size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
        <div className="text-[13px] leading-relaxed text-red-800 dark:text-red-200">
          <p className="text-[14px] font-semibold">Your store no longer takes new orders</p>
          {reason && <p className="mt-1">Reason: {reason}</p>}
          <p className="mt-1">
            Please finish the orders already paid: deliver them and enter each buyer&apos;s code. You&apos;re paid for them as usual.
            You can reapply to sell from{" "}
            <Link href="/marketplace/sell" className="font-semibold underline underline-offset-2">
              this page
            </Link>{" "}
            once your waiting period ends.
          </p>
        </div>
      </section>
      <div className="flex gap-2" role="tablist" aria-label="Seller Hub">
        {FINISH_TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => setTab(item.key)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              tab === item.key ? "bg-violet-600 text-white" : "border border-line-strong text-muted hover:border-violet-200 dark:hover:border-violet-500/30"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        {tab === "orders" && <OrdersView />}
        {tab === "returns" && <ReturnsView />}
        {tab === "earnings" && <EarningsView />}
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
