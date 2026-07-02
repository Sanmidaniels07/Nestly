"use client";

import { useAuthStore } from "@/src/store/auth-store";
import HeroCard from "./hero-card";
import QuickActions from "./quick-actions";


export default function DashboardPage() {
  const user =
      useAuthStore(
        (state) => state.user
      );
  
  return (
    <div
      className="
      space-y-8
      max-w-7xl
      mx-auto
    "
    >
      <HeroCard
        name={user?.name || "Daniel"}
      />

      <QuickActions />

      <div
        className="
        grid
        lg:grid-cols-3
        gap-8
      "
      >
        <div
          className="
          lg:col-span-2
        "
        >
          {/* Feed */}
        </div>

        <div
          className="
          space-y-6
        "
        >
          {/* <SuggestedUsers />

          <NotificationsWidget />

          <MarketplaceWidget /> */}
        </div>
      </div>
    </div>
  );
}