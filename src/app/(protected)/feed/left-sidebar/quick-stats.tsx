"use client";

import { Eye, FileText, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";
import { useProfile } from "@/src/hooks/use-profile";
import { useUserProfile } from "@/src/hooks/use-user-profile";
import { usePosts } from "@/src/hooks/use-posts";
import Skeleton from "@/src/components/ui/skeleton";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function QuickStats() {
  const authUser = useAuthStore((state) => state.user);
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: userProfile, isLoading: isUserProfileLoading } = useUserProfile(
    authUser?.id ?? ""
  );
  const { data: postsData } = usePosts(
    { authorId: authUser?.id, sort: "desc" },
    { enabled: !!authUser?.id }
  );

  if (isProfileLoading || isUserProfileLoading) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-6 h-1.5 w-full rounded-full" />
        <div className="mt-6 space-y-4 border-t border-[#F2F1F8] pt-5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
        </div>
      </div>
    );
  }

  const postsThisWeek =
    postsData?.pages
      .flatMap((page) => page.data.posts)
      .filter((post) => Date.now() - new Date(post.createdAt).getTime() < ONE_WEEK_MS)
      .length ?? 0;

  const completion = profile?.profileCompletion ?? 0;

  const metrics = [
    { icon: FileText, label: "Posts this week", value: postsThisWeek },
    { icon: Eye, label: "Profile views", value: userProfile?.profileViews ?? 0 },
  ];

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-violet-600" />
        <h3 className="text-[15px] font-semibold text-[#13131A]">
          Your activity
        </h3>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-[#64748B]">
            Profile completion
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-600">
            {completion}%
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0EEF9]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3.5 border-t border-[#F2F1F8] pt-5">
        {metrics.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#64748B]">
              <Icon size={15} />
              <span className="text-[13.5px]">{label}</span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-[#13131A]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
