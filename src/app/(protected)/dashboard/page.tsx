"use client";

import { useAuthStore } from "@/src/store/auth-store";
import HeroCard from "./hero-card";
import QuickActions from "./quick-actions";
import MarketplacePicks from "./marketplace-widget";
import RecentActivity from "./recent-activity";
import SuggestedUsers from "./suggested-users";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        <HeroCard name={user?.name || "Daniel"} />

        <QuickActions />

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-6">Your Feed</h3>
              <p className="text-gray-500 text-center py-12">Your community feed will appear here</p>
            </div>
          </div>

         <div className="lg:col-span-4 space-y-8">
        <SuggestedUsers />
        <RecentActivity />
        <MarketplacePicks />
      </div>
        </div>
      </div>
    </div>
  );
}