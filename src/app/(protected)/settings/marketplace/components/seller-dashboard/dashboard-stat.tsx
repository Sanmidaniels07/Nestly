"use client";

import { Package, ShoppingBag, Users, Wallet, Star, TrendingUp } from "lucide-react";
import StatCard from "./stat-card";

export default function DashboardStats() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Products"
        value="148"
        subtitle="12 added this month"
        icon={Package}
        color="bg-violet-50"
        iconColor="text-violet-600"
      />

      <StatCard
        title="Orders"
        value="63"
        subtitle="9 awaiting shipment"
        icon={ShoppingBag}
        color="bg-amber-50"
        iconColor="text-amber-600"
      />

      <StatCard
        title="Customers"
        value="2,481"
        icon={Users}
        color="bg-indigo-50"
        iconColor="text-indigo-600"
        trend={{ value: "+154", direction: "up" }}
        subtitle="this month"
      />

      <StatCard
        title="Revenue"
        value="₦18.4M"
        icon={Wallet}
        color="bg-emerald-50"
        iconColor="text-emerald-600"
        trend={{ value: "+18%", direction: "up" }}
        subtitle="vs last month"
      />

      <StatCard
        title="Store rating"
        value="4.9"
        subtitle="184 reviews"
        icon={Star}
        color="bg-rose-50"
        iconColor="text-rose-600"
      />

      <StatCard
        title="Growth"
        value="+18%"
        icon={TrendingUp}
        color="bg-emerald-50"
        iconColor="text-emerald-600"
        trend={{ value: "+4.2pp", direction: "up" }}
        subtitle="vs last month"
      />
    </section>
  );
}