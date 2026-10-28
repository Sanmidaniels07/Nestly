"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import { usePosts } from "@/src/hooks/use-posts";
import { useProfile } from "@/src/hooks/use-profile";
import { useUserDashboard } from "@/src/hooks/use-user-dashboard";
import { DashboardRange } from "@/src/types/user-dashboard";
import PostCard from "@/src/app/(protected)/feed/main-feed/post-card";
import { PostListSkeleton } from "@/src/components/skeletons/post-card-skeleton";
import HeroCard from "./hero-card";
import DashboardStats from "./dashboard-stats";
import ActivityChart from "./activity-chart";
import SellerSnapshot from "./seller-snapshot";
import ShoppingCard from "./shopping-card";
import UpcomingCard from "./upcoming-card";
import MarketplacePicks from "./marketplace-widget";
import RecentActivity from "./recent-activity";
import SuggestedUsers from "./suggested-users";
import DashboardSkeleton from "./dashboard-skeleton";
import CacReminderBanner from "@/src/app/(protected)/settings/marketplace/components/seller-dashboard/cac-reminder-banner";
import SetupReminderBanner from "@/src/app/(protected)/settings/marketplace/components/seller-dashboard/setup-reminder-banner";
import ProfileChecklist from "./profile-checklist";
import PushPrompt from "@/src/components/push/push-prompt";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [range, setRange] = useState<DashboardRange>(30);

  const { data: dashboard, isLoading, isError, isFetching, refetch } = useUserDashboard(range);
  const { data: profile } = useProfile();
  const { data: postsData, isLoading: isPostsLoading, isError: isPostsError } = usePosts({ sort: "desc" });

  const posts = postsData?.pages[0]?.data.posts ?? [];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20 pt-6 sm:space-y-8">
      <HeroCard name={user?.name || "there"} data={dashboard} profileCompletion={profile?.profileCompletion} />

      {!!dashboard?.seller?.missingSetup?.length && <SetupReminderBanner />}

      {dashboard?.seller?.needsCacNumber && <CacReminderBanner />}

      <PushPrompt />

      {/* Only once the profile has loaded, so it doesn't flash for people who are done. */}
      {profile?.setupSteps && (
        <Suspense fallback={null}>
          <ProfileChecklist steps={profile.setupSteps} />
        </Suspense>
      )}

      {isError && !dashboard && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-500/30 dark:bg-red-500/10 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[13.5px] text-red-700 dark:text-red-300">Couldn&apos;t load your dashboard stats.</p>
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-red-200 bg-surface px-4 py-2 text-[13px] font-semibold text-red-700 dark:border-red-500/30 dark:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {dashboard && <DashboardStats data={dashboard} />}

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 space-y-6 lg:col-span-8">
          {dashboard && (
            <>
              <ActivityChart data={dashboard.activity} range={range} onRangeChange={setRange} isFetching={isFetching} />
              <SellerSnapshot seller={dashboard.seller} range={range} />
            </>
          )}

          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
                  For you
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[24px] italic leading-none text-ink sm:text-[26px]">
                  Latest from your feed
                </h2>
              </div>

              <Link
                href="/feed"
                className="group flex shrink-0 items-center gap-1.5 text-[13.5px] font-semibold text-violet-600 hover:underline dark:text-violet-400"
              >
                View feed
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-6">
              {isPostsLoading && <PostListSkeleton count={2} />}

              {isPostsError && (
                <p className="py-16 text-center text-[13.5px] text-red-500">Couldn&apos;t load the feed. Please try again.</p>
              )}

              {!isPostsLoading && !isPostsError && posts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
                  <Newspaper className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
                  <p className="mt-4 text-[13.5px] text-subtle">No posts yet. Be the first to share something.</p>
                </div>
              )}

              {!isPostsLoading && !isPostsError && posts.length > 0 && (
                <div className="space-y-5">
                  {posts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-4">
          {dashboard && (
            <>
              <ShoppingCard shopping={dashboard.shopping} />
              <UpcomingCard birthdays={dashboard.upcomingBirthdays} community={dashboard.community} />
            </>
          )}
          <SuggestedUsers />
          <RecentActivity />
          <MarketplacePicks />
        </div>
      </div>
    </div>
  );
}
