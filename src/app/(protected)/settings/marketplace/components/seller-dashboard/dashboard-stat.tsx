"use client";

import { Package, ShoppingBag, Wallet, Star } from "lucide-react";
import StatCard from "./stat-card";
import { useSellerDashboardStats } from "@/src/hooks/use-seller-dashboard-stats";

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useSellerDashboardStats();

  if (isLoading || !stats) {
    return (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[110px] animate-pulse rounded-2xl border border-[#ECE9F6] bg-[#F7F7FB]" />
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Products"
        value={stats.totalProducts.toString()}
        icon={Package}
        color="bg-violet-50"
        iconColor="text-violet-600"
      />

      <StatCard
        title="Orders"
        value={stats.totalOrders.toString()}
        subtitle={stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : undefined}
        icon={ShoppingBag}
        color="bg-amber-50"
        iconColor="text-amber-600"
      />

      <StatCard
        title="Revenue"
        value={formatNaira(stats.totalRevenue)}
        icon={Wallet}
        color="bg-emerald-50"
        iconColor="text-emerald-600"
      />

      {stats.storeRating !== undefined && (
        <StatCard
          title="Store rating"
          value={stats.storeRating.toString()}
          icon={Star}
          color="bg-rose-50"
          iconColor="text-rose-600"
        />
      )}
    </section>
  );
}
