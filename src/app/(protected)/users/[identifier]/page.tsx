"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ban, CalendarDays, Globe, MapPin, MessageCircle, ShieldOff, Users } from "lucide-react";
import {
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaFacebook,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import { IconType } from "react-icons";

import { useAuthStore } from "@/src/store/auth-store";
import { useUserProfile } from "@/src/hooks/use-user-profile";
import { useFollowStatus } from "@/src/hooks/use-follow-status";
import { useToggleFollow } from "@/src/hooks/use-toggle-follow";
import { usePosts } from "@/src/hooks/use-posts";
import { useCreateConversation } from "@/src/hooks/use-create-conversation";
import FollowButton from "@/src/components/social/follow-button";
import ReportButton from "@/src/components/ui/report-button";
import PostCard from "../../feed/main-feed/post-card";
import { UserProfileHeaderSkeleton } from "@/src/components/skeletons/profile-header-skeleton";
import { PostListSkeleton } from "@/src/components/skeletons/post-card-skeleton";
import { useBlockedUsers } from "@/src/hooks/use-blocked-users";
import { useBlockUser } from "@/src/hooks/use-block-user";
import { useUnblockUser } from "@/src/hooks/use-unblock-user";

function formatCount(n?: number) {
  const value = n ?? 0;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function formatJoinedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = use(params);
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);

  const { data: user, isLoading } = useUserProfile(identifier);
  const isSelf = !!user && user.id === authUser?.id;

  const { mutate: createConversation, isPending: isStartingChat } = useCreateConversation();

  const { data: blockedData } = useBlockedUsers({ limit: 100 });
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser();
  const isBlocked = !!user && (blockedData?.blockedUsers ?? []).some((b) => b.id === user.id);

  const handleMessage = () => {
    if (!user) return;
    createConversation(user.id, {
      onSuccess: (response) => router.push(`/messages/${response.data.id}`),
    });
  };

  const socialLinks: { href?: string; label: string; icon: IconType }[] = [
    { href: user?.socialLinks?.twitter, label: "X", icon: FaXTwitter },
    { href: user?.socialLinks?.instagram, label: "Instagram", icon: FaInstagram },
    { href: user?.socialLinks?.facebook, label: "Facebook", icon: FaFacebook },
    { href: user?.socialLinks?.linkedin, label: "LinkedIn", icon: FaLinkedin },
    { href: user?.socialLinks?.tiktok, label: "TikTok", icon: FaTiktok },
    { href: user?.socialLinks?.youtube, label: "YouTube", icon: FaYoutube },
  ];

  const { data: postsData } = usePosts(
    { authorId: user?.id, sort: "desc" },
    { enabled: !!user?.id }
  );
  const posts = postsData?.pages.flatMap((page) => page.data.posts) ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 pb-20 pt-6">
        <UserProfileHeaderSkeleton />
        <PostListSkeleton count={2} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl pb-20 pt-16 text-center">
        <p className="text-[15px] font-medium text-[#13131A]">User not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20 pt-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-violet-700"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="rounded-2xl border border-[#EDEBF5] bg-white p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-[32px] font-semibold text-white">
              {user.name?.trim()?.charAt(0).toUpperCase() || "?"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] italic leading-none text-[#13131A]">
                  {user.name}
                </h1>
                {user.username && (
                  <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[13px] text-violet-600">
                    @{user.username}
                  </p>
                )}
              </div>

              {!isSelf && (
                <div className="flex items-center gap-2">
                  <FollowStatusButton userId={user.id} />
                  <button
                    onClick={handleMessage}
                    disabled={isStartingChat}
                    className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] px-4 py-2 text-[13px] font-semibold text-[#334155] transition-colors hover:border-violet-300 hover:text-violet-600 disabled:opacity-50"
                  >
                    <MessageCircle size={14} />
                    Message
                  </button>
                  <ReportButton
                    targetType="USER"
                    targetId={user.id}
                    label=""
                    className="flex items-center justify-center rounded-full border border-[#E5E7EB] p-2 text-[#94A3B8] transition-colors hover:border-red-200 hover:text-red-500"
                  />
                  <button
                    onClick={() =>
                      isBlocked ? unblockUser(user.id) : blockUser(user.id)
                    }
                    disabled={isBlocking || isUnblocking}
                    aria-label={isBlocked ? "Unblock user" : "Block user"}
                    className="flex items-center justify-center rounded-full border border-[#E5E7EB] p-2 text-[#94A3B8] transition-colors hover:border-red-200 hover:text-red-500 disabled:opacity-50"
                  >
                    {isBlocked ? <ShieldOff size={15} /> : <Ban size={15} />}
                  </button>
                </div>
              )}
            </div>

            {user.bio && (
              <p className="mt-4 text-[14.5px] leading-relaxed text-[#475569]">
                {user.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-[13px] text-[#64748B] sm:justify-start">
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {user.location}
                </div>
              )}

              {user.website && (
                <Link
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-violet-600 hover:underline"
                >
                  <Globe size={15} />
                  Website
                </Link>
              )}

              <div className="flex items-center gap-1.5">
                <CalendarDays size={15} />
                Joined{" "}
                <span className="font-[family-name:var(--font-mono)]">
                  {formatJoinedDate(user.createdAt)}
                </span>
              </div>
            </div>

            {socialLinks.some((link) => link.href) && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                {socialLinks.map(
                  ({ href, label, icon: Icon }) =>
                    href && (
                      <Link
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-[#E7E5F2] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#13131A] transition-all hover:border-violet-400 hover:text-violet-700"
                      >
                        <Icon size={13} />
                        {label}
                      </Link>
                    )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-[#F0EEF9] border-t border-[#F2F1F8] pt-6">
          {[
            { label: "Posts", value: user.postsCount },
            { label: "Followers", value: user.followersCount },
            { label: "Following", value: user.followingCount },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-[family-name:var(--font-mono)] text-[18px] font-semibold text-[#13131A]">
                {formatCount(stat.value)}
              </p>
              <p className="mt-0.5 text-[12px] text-[#94A3B8]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
            <Users className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
            <p className="mt-4 text-[15px] font-medium text-[#13131A]">
              No posts yet
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

function FollowStatusButton({ userId }: { userId: string }) {
  const { data: isFollowingReal, isLoading } = useFollowStatus(userId);

  if (isLoading) {
    return <div className="h-9 w-28 animate-pulse rounded-full bg-[#F7F7FB]" />;
  }

  return (
    <FollowStatusButtonInner
      key={String(isFollowingReal)}
      userId={userId}
      initialIsFollowing={isFollowingReal ?? false}
    />
  );
}

function FollowStatusButtonInner({
  userId,
  initialIsFollowing,
}: {
  userId: string;
  initialIsFollowing: boolean;
}) {
  const { isFollowing, toggleFollow } = useToggleFollow(userId, initialIsFollowing);
  return <FollowButton isFollowing={isFollowing} onClick={toggleFollow} />;
}
