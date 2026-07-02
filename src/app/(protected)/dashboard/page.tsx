"use client";

import { useAuthStore } from "@/src/store/auth-store";
import HeroCard from "./hero-card";
import QuickActions from "./quick-actions";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        {/* Hero Welcome */}
        <HeroCard name={user?.name || "Daniel"} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Feed / Main Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Feed content goes here */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-6">Your Feed</h3>
              <p className="text-gray-500 text-center py-12">Your community feed will appear here</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Suggested Users / Trending */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-6">Suggested for you</h3>
              {/* Suggested users content */}
            </div>

            {/* Notifications Widget */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
              {/* Notifications content */}
            </div>

            {/* Marketplace Teaser */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-6">Marketplace Picks</h3>
              {/* Marketplace teaser content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}