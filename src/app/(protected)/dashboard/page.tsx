"use client";

import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";
import { usePosts } from "@/src/hooks/use-posts";
import PostCard from "@/src/app/(protected)/feed/main-feed/post-card";
import HeroCard from "./hero-card";
import QuickActions from "./quick-actions";
import MarketplacePicks from "./marketplace-widget";
import RecentActivity from "./recent-activity";
import SuggestedUsers from "./suggested-users";
import { PostListSkeleton } from "@/src/components/skeletons/post-card-skeleton";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = usePosts({ sort: "desc" });

  const posts = data?.pages[0]?.data.posts ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-20 pt-6">
      <HeroCard name={user?.name || "there"} />

      <QuickActions />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-[#ECE9F6] bg-white p-7 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.3em] text-violet-600">
                  For you
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic leading-none text-[#13131A]">
                  Your feed
                </h2>
              </div>

              <Link
                href="/feed"
                className="group flex shrink-0 items-center gap-1.5 text-[13.5px] font-semibold text-violet-600 hover:underline"
              >
                View full feed
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-7">
              {isLoading && <PostListSkeleton count={2} />}

              {isError && (
                <p className="py-16 text-center text-[13.5px] text-red-500">
                  Couldn&apos;t load the feed. Please try again.
                </p>
              )}

              {!isLoading && !isError && posts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
                  <Newspaper className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
                  <p className="mt-4 text-[13.5px] text-[#94A3B8]">
                    No posts yet. Be the first to share something.
                  </p>
                </div>
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
        </div>

        <div className="space-y-6 lg:col-span-4">
          <SuggestedUsers />
          <RecentActivity />
          <MarketplacePicks />
        </div>
      </div>
    </div>
  );
}
