"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, BarChart3, CircleAlert, ExternalLink, Minus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useAdminOverview } from "@/src/hooks/use-admin-overview";
import { AdminOverview, OverviewRange, OverviewSource } from "@/src/types/admin-overview";
import Skeleton from "@/src/components/ui/skeleton";

const RANGES: OverviewRange[] = [7, 30, 90];

const SOURCE_LABEL: Record<OverviewSource, string> = {
  GOOGLE: "Google search",
  OTHER_SEARCH: "Other search engines",
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  TIKTOK: "TikTok",
  X: "X (Twitter)",
  SELLER_LINK: "Seller share links",
  PAYMENT_LINK: "Payment links",
  OTHER_SITE: "Other websites",
  DIRECT: "Typed in / bookmarks",
  UNKNOWN: "Not recorded (before tracking)",
};

const naira = (value: number, compact = false) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: compact && value >= 100_000 ? "compact" : "standard",
    maximumFractionDigits: compact && value >= 100_000 ? 1 : 0,
  }).format(value);

const count = (value: number) =>
  new Intl.NumberFormat("en", { notation: value >= 10_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);

const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" });

// The whole platform at a glance for admins - every number comes from
// GET /api/admin/overview. Website visits live in Vercel Analytics.
export default function OverviewDashboard() {
  const [days, setDays] = useState<OverviewRange>(30);
  const { data, isLoading, isError, isFetching, refetch } = useAdminOverview(days);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex self-start rounded-xl bg-surface-2 p-1" role="group" aria-label="Date range">
          {RANGES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDays(option)}
              aria-pressed={days === option}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-medium transition-all ${
                days === option ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300" : "text-muted hover:text-ink"
              }`}
            >
              Last {option} days
            </button>
          ))}
        </div>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          <BarChart3 size={15} /> Website visits (Vercel Analytics) <ExternalLink size={13} />
        </a>
      </div>

      {isLoading && <OverviewSkeleton />}

      {isError && !data && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-[13.5px] text-red-700 dark:text-red-300">Couldn&apos;t load the overview.</p>
          <button onClick={() => refetch()} className="rounded-lg border border-red-200 bg-surface px-3 py-1.5 text-[13px] font-semibold text-red-700 dark:border-red-500/30 dark:text-red-300">
            Try again
          </button>
        </div>
      )}

      {data && (
        <div className={`space-y-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          <NeedsAttention data={data} />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Sales" value={naira(data.orders.sales, true)} now={data.orders.sales} prev={data.orders.salesPrev} days={days} hint="What buyers paid on orders that went through" />
            <StatTile label="Paid orders" value={count(data.orders.paid)} now={data.orders.paid} prev={data.orders.paidPrev} days={days} />
            <StatTile label="Nestly commission" value={naira(data.orders.commission, true)} now={data.orders.commission} prev={data.orders.commissionPrev} days={days} />
            <StatTile label="New users" value={count(data.users.new)} now={data.users.new} prev={data.users.newPrev} days={days} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <DailyChart
              title="Sales per day"
              data={data.daily}
              dataKey="sales"
              format={(value) => naira(value, true)}
              empty="No paid orders in this period yet."
            />
            <DailyChart
              title="Sign-ups per day"
              data={data.daily}
              dataKey="signups"
              format={(value) => count(value)}
              empty="No sign-ups in this period yet."
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SourceBars
              title="Where paying buyers come from"
              subtitle="Paid orders by the channel that brought the buyer, ranked by sales"
              rows={data.sources.orders.map((row) => ({ source: row.source, value: row.sales, label: `${naira(row.sales, true)} · ${count(row.orders)} order${row.orders === 1 ? "" : "s"}` }))}
              empty="No paid orders in this period yet."
            />
            <SourceBars
              title="Where sign-ups come from"
              subtitle="New accounts by the channel that brought them"
              rows={data.sources.signups.map((row) => ({ source: row.source, value: row.count, label: count(row.count) }))}
              empty="No sign-ups in this period yet."
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <FactCard
              title="Users"
              facts={[
                ["Total", count(data.users.total)],
                [`Active in the last ${days} days`, count(data.users.active)],
                ["Email verified", count(data.users.verified)],
                ["Signed up with Google", count(data.users.google)],
                ["Suspended / banned", `${count(data.users.suspended)} / ${count(data.users.banned)}`],
              ]}
              href="/admin?tab=users"
            />
            <FactCard
              title="Sellers"
              facts={[
                ["Applications waiting", count(data.sellers.pending)],
                [`New applications (${days} days)`, count(data.sellers.newApplications)],
                ["Approved", count(data.sellers.approved)],
                ["Ready to take orders", `${count(data.sellers.readyToSell)} of ${count(data.sellers.approved)}`],
                ["Business verified (CAC)", count(data.sellers.verified)],
                ["Stores (suspended)", `${count(data.sellers.stores)} (${count(data.sellers.suspendedStores)})`],
              ]}
              href="/admin?tab=sellers"
            />
            <FactCard
              title="Products & orders"
              facts={[
                ["Live products", count(data.products.live)],
                ["Sold out / drafts", `${count(data.products.soldOut)} / ${count(data.products.drafts)}`],
                ["Average order", naira(data.orders.averageOrder)],
                ["Payment-link sales", `${naira(data.orders.paymentLinkSales, true)} (${count(data.orders.paymentLinkOrders)})`],
                ["Delivery fees (to sellers)", naira(data.orders.deliveryFees, true)],
                ["Unpaid checkouts / cancelled", `${count(data.orders.unpaidCheckouts)} / ${count(data.orders.cancelled)}`],
              ]}
              href="/admin?tab=products"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TopTable
              title="Top stores"
              columns={["Store", "Orders", "Sales"]}
              rows={data.topStores.map((store) => [
                <Link key="name" href={`/marketplace/seller/${store.slug}`} className="font-medium text-ink hover:text-violet-600 dark:hover:text-violet-400">
                  {store.name}
                </Link>,
                count(store.orders),
                naira(store.sales, true),
              ])}
              empty="No sales in this period yet."
            />
            <TopTable
              title="Top products"
              columns={["Product", "Units", "Sales"]}
              rows={data.topProducts.map((product) => [
                <span key="name" className="block min-w-0">
                  <span className="block truncate font-medium text-ink">{product.title}</span>
                  <span className="block truncate text-[12px] text-muted">
                    {product.storeName}
                    {product.isPaymentLink ? " · payment link" : ""}
                  </span>
                </span>,
                count(product.units),
                naira(product.sales, true),
              ])}
              empty="No sales in this period yet."
            />
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h3 className="text-[15px] font-semibold text-ink">Browsing by signed-in people</h3>
            <p className="mt-0.5 text-[12.5px] text-muted">Guests aren&apos;t counted here - Vercel Analytics has every visit.</p>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Products viewed", data.engagement.productViews],
                ["Store visits", data.engagement.storeViews],
                ["Profile views", data.engagement.profileViews],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-xl bg-surface-2 px-3 py-3">
                  <dt className="text-[12px] text-muted">{label}</dt>
                  <dd className="mt-1 text-[20px] font-semibold text-ink">{count(value as number)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function NeedsAttention({ data }: { data: AdminOverview }) {
  const items = [
    data.sellers.pending > 0 && {
      text: `${data.sellers.pending} seller application${data.sellers.pending === 1 ? "" : "s"} waiting for review`,
      href: "/admin?tab=sellers",
    },
    data.orders.refundsToDo > 0 && {
      text: `${data.orders.refundsToDo} sold-out refund${data.orders.refundsToDo === 1 ? "" : "s"} to do by hand in Paystack`,
      href: "/admin?tab=payouts",
    },
  ].filter(Boolean) as { text: string; href: string }[];

  if (items.length === 0) return null;

  return (
    <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
      {items.map((item) => (
        <Link key={item.text} href={item.href} className="flex items-center gap-2.5 text-[13.5px] font-medium text-ink hover:underline">
          <CircleAlert size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
          {item.text}
        </Link>
      ))}
    </div>
  );
}

function StatTile({ label, value, now, prev, days, hint }: { label: string; value: string; now: number; prev: number; days: number; hint?: string }) {
  const change = prev > 0 ? Math.round(((now - prev) / prev) * 100) : null;
  const direction = now === prev ? "flat" : now > prev ? "up" : "down";
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const tone =
    direction === "up" ? "text-emerald-700 dark:text-emerald-400" : direction === "down" ? "text-red-600 dark:text-red-400" : "text-muted";

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5" title={hint}>
      <p className="text-[12.5px] text-muted">{label}</p>
      <p className="mt-1.5 truncate text-[24px] font-semibold leading-tight text-ink sm:text-[26px]">{value}</p>
      <p className={`mt-1.5 flex items-start gap-1 text-[12px] font-medium leading-snug ${tone}`}>
        <Icon size={14} className="mt-px shrink-0" />
        <span>
          {change === null ? (now > 0 ? "New this period" : "No change") : `${change > 0 ? "+" : ""}${change}%`}
          <span className="font-normal text-muted"> vs previous {days} days</span>
        </span>
      </p>
    </div>
  );
}

interface DailyPoint {
  date: string;
  signups: number;
  orders: number;
  sales: number;
}

function DailyChart({
  title,
  data,
  dataKey,
  format,
  empty,
}: {
  title: string;
  data: DailyPoint[];
  dataKey: "sales" | "signups";
  format: (value: number) => string;
  empty: string;
}) {
  const total = data.reduce((sum, point) => sum + point[dataKey], 0);
  const peak = data.reduce((best, point) => (point[dataKey] > best[dataKey] ? point : best), data[0]);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        <p className="text-[12.5px] text-muted">
          {format(total)} total{total > 0 && peak ? ` · best ${shortDate(peak.date)}` : ""}
        </p>
      </div>

      <div className="relative mt-4 h-[220px] text-violet-600 dark:text-violet-500">
        {total === 0 && (
          <p className="absolute inset-0 z-10 flex items-center justify-center text-[13px] text-subtle">{empty}</p>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid stroke="var(--line-soft)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              tick={{ fill: "var(--subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              hide={total === 0}
              allowDecimals={false}
              tickFormatter={(value: number) => (dataKey === "sales" ? naira(value, true) : count(value))}
              tick={{ fill: "var(--subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={dataKey === "sales" ? 64 : 32}
            />
            {total > 0 && (
              <Tooltip
                cursor={{ fill: "var(--surface-2)" }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-[0_12px_32px_-12px_rgba(15,15,20,0.25)]">
                      <p className="text-[11.5px] text-subtle">{shortDate(String(label))}</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-ink">{format(Number(payload[0].value))}</p>
                      {dataKey === "sales" && (
                        <p className="text-[12px] text-muted">
                          {(payload[0].payload as DailyPoint).orders} order{(payload[0].payload as DailyPoint).orders === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>
                  ) : null
                }
              />
            )}
            <Bar dataKey={dataKey} fill="currentColor" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className="mt-3 text-[12.5px] text-muted">
        <summary className="cursor-pointer select-none hover:text-ink">View as table</summary>
        <div className="mt-2 max-h-56 overflow-y-auto">
          <table className="w-full text-left">
            <tbody>
              {data
                .filter((point) => point[dataKey] > 0)
                .map((point) => (
                  <tr key={point.date} className="border-t border-line-soft">
                    <td className="py-1.5">{shortDate(point.date)}</td>
                    <td className="py-1.5 text-right tabular-nums text-ink">{format(point[dataKey])}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function SourceBars({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle: string;
  rows: { source: OverviewSource; value: number; label: string }[];
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-0.5 text-[12.5px] text-muted">{subtitle}</p>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-subtle">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.source}>
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="truncate text-ink-2">{SOURCE_LABEL[row.source] ?? row.source}</span>
                <span className="shrink-0 font-medium text-ink">{row.label}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-violet-600 dark:bg-violet-500"
                  style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FactCard({ title, facts, href }: { title: string; facts: [string, string][]; href: string }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        <Link href={href} className="text-[12.5px] font-medium text-violet-600 hover:underline dark:text-violet-400">
          See list
        </Link>
      </div>
      <dl className="mt-3 divide-y divide-line-soft">
        {facts.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="text-[13px] text-muted">{label}</dt>
            <dd className="shrink-0 text-[13.5px] font-semibold tabular-nums text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TopTable({ title, columns, rows, empty }: { title: string; columns: string[]; rows: React.ReactNode[][]; empty: string }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-subtle">{empty}</p>
      ) : (
        <table className="mt-3 w-full table-fixed text-[13px]">
          <thead>
            <tr className="text-left text-[12px] text-muted">
              {columns.map((column, i) => (
                <th key={column} className={`pb-2 font-medium ${i === 0 ? "w-[58%]" : "text-right"}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, r) => (
              <tr key={r} className="border-t border-line-soft">
                {cells.map((cell, i) => (
                  <td key={i} className={`py-2.5 ${i === 0 ? "truncate pr-3" : "text-right tabular-nums text-ink"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[118px] rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-2xl" />
        <Skeleton className="h-[300px] rounded-2xl" />
      </div>
    </div>
  );
}
