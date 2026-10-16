"use client";

import Link from "next/link";
import { ArrowRight, Clock, Package, ShoppingBag, Store, Users, Wallet, XCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

import { useSellerDashboardStats } from "@/src/hooks/use-seller-dashboard-stats";
import { useSellerSalesOverview } from "@/src/hooks/use-seller-sales-overview";
import { DashboardRange, UserDashboard } from "@/src/types/user-dashboard";
import { formatCount, formatNaira, shortDate } from "./format";

interface Props {
  seller: UserDashboard["seller"];
  range: DashboardRange;
}

const sectionLabel =
  "font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400";
const sectionTitle = "mt-2 font-[family-name:var(--font-fraunces)] text-[24px] italic leading-none text-ink sm:text-[26px]";

// The dashboard's seller section adapts to where the user is in the
// selling journey: not selling, under review, rejected, approved without a
// store, or running a store (live numbers).
export default function SellerSnapshot({ seller, range }: Props) {
  if (!seller) {
    return (
      <CalloutCard
        icon={Store}
        title="Start selling on Nestly"
        body="Turn your following into customers. Open a store, list products and get paid straight to your bank."
        cta="Become a seller"
        href="/marketplace/sell"
      />
    );
  }

  if (seller.status === "PENDING") {
    return (
      <CalloutCard
        icon={Clock}
        tone="amber"
        title="Seller application under review"
        body="We'll notify you as soon as it's approved — then you can set up your store."
        cta="View application"
        href="/marketplace/sell"
      />
    );
  }

  if (seller.status === "REJECTED") {
    return (
      <CalloutCard
        icon={XCircle}
        tone="red"
        title="Seller application not approved"
        body="See the reason and when you can apply again."
        cta="View details"
        href="/marketplace/sell"
      />
    );
  }

  if (!seller.hasStore) {
    return (
      <CalloutCard
        icon={Store}
        title="You're approved — set up your store"
        body="Add your store name and location, then your payout account and first product."
        cta="Set up store"
        href="/marketplace/sell"
      />
    );
  }

  return <StorePerformance storeName={seller.store?.name ?? "Your store"} range={range} />;
}

function StorePerformance({ storeName, range }: { storeName: string; range: DashboardRange }) {
  const { data: stats, isLoading: isStatsLoading } = useSellerDashboardStats();
  const { data: sales = [], isLoading: isSalesLoading } = useSellerSalesOverview(range);

  const periodRevenue = sales.reduce((sum, point) => sum + point.revenue, 0);
  const hasSales = sales.some((point) => point.revenue > 0);

  const metrics = stats
    ? [
        { label: "Total revenue", value: formatNaira(stats.totalRevenue), icon: Wallet },
        { label: "Orders", value: formatCount(stats.totalOrders), icon: ShoppingBag, note: stats.pendingOrders > 0 ? `${stats.pendingOrders} to fulfil` : undefined },
        { label: "Products", value: formatCount(stats.totalProducts), icon: Package },
        { label: "Customers", value: formatCount(stats.totalCustomers), icon: Users },
      ]
    : [];

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className={sectionLabel}>Your store</p>
          <h2 className={`${sectionTitle} truncate`}>{storeName}</h2>
        </div>
        <Link
          href="/settings/marketplace"
          className="group flex shrink-0 items-center gap-1.5 text-[13.5px] font-semibold text-violet-600 hover:underline dark:text-violet-400"
        >
          Seller dashboard
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {isStatsLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[84px] animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="min-w-0 rounded-xl bg-surface-sunken p-4">
              <p className="flex items-center gap-1.5 text-[12px] text-muted">
                <metric.icon size={13} className="shrink-0 text-subtle" />
                <span className="truncate">{metric.label}</span>
              </p>
              <p className="mt-2 truncate font-[family-name:var(--font-mono)] text-[19px] font-semibold text-ink sm:text-[21px]">
                {metric.value}
              </p>
              {metric.note && (
                <p className="mt-0.5 text-[11.5px] font-medium text-amber-600 dark:text-amber-400">{metric.note}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-xl border border-line-soft p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[12.5px] text-muted">Revenue · last {range} days</p>
          <p className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-ink">{formatNaira(periodRevenue)}</p>
        </div>
        <div className="mt-2 h-[90px]">
          {isSalesLoading ? (
            <div className="h-full animate-pulse rounded-lg bg-surface-2" />
          ) : hasSales ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sales} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="storeRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={{ stroke: "var(--track)" }}
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="rounded-lg border border-line bg-surface px-3 py-2 text-[12px] shadow-md">
                        <p className="text-subtle">{shortDate(String(label ?? payload[0].payload.date))}</p>
                        <p className="font-[family-name:var(--font-mono)] font-semibold text-ink">
                          {formatNaira(Number(payload[0].value))}
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#storeRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-full items-center justify-center text-center text-[12.5px] text-subtle">
              No sales in this period yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

const TONES = {
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

function CalloutCard({
  icon: Icon,
  title,
  body,
  cta,
  href,
  tone = "violet",
}: {
  icon: typeof Store;
  title: string;
  body: string;
  cta: string;
  href: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{body}</p>
      </div>
      <Link
        href={href}
        className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-[13px] font-semibold text-white transition-all hover:brightness-110"
      >
        {cta}
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
