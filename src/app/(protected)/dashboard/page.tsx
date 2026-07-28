"use client";

import Link from "next/link";
import { useAuthStore } from "@/src/store/auth-store";
import { usePosts } from "@/src/hooks/use-posts";
import PostCard from "@/src/app/(protected)/feed/main-feed/post-card";
import HeroCard from "./hero-card";
import QuickActions from "./quick-actions";
import MarketplacePicks from "./marketplace-widget";
import RecentActivity from "./recent-activity";
import SuggestedUsers from "./suggested-users";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = usePosts({ sort: "desc" });

  const posts = data?.pages[0]?.data.posts ?? [];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        <HeroCard name={user?.name || "Daniel"} />

        <QuickActions />

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Your Feed</h3>
                <Link
                  href="/feed"
                  className="text-sm font-medium text-violet-600 hover:underline"
                >
                  View full feed →
                </Link>
              </div>

              {isLoading && (
                <p className="text-gray-500 text-center py-12">Loading posts...</p>
              )}

              {isError && (
                <p className="text-red-500 text-center py-12">
                  Couldn&apos;t load the feed. Please try again.
                </p>
              )}

              {!isLoading && !isError && posts.length === 0 && (
                <p className="text-gray-500 text-center py-12">
                  No posts yet. Be the first to share something.
                </p>
              )}

              {!isLoading && !isError && posts.length > 0 && (
                <div className="space-y-5">
                  {posts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
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
