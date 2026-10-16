"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, Hash, Search, Store, Users2 } from "lucide-react";

import { useSearchByType } from "@/src/hooks/use-search-by-type";
import { useFollowStatus } from "@/src/hooks/use-follow-status";
import { useToggleFollow } from "@/src/hooks/use-toggle-follow";
import { useToggleCommunityMembership } from "@/src/hooks/use-toggle-community-membership";
import { SearchResultType, SearchStore, SearchUser } from "@/src/types/search";
import { Community } from "@/src/types/community";
import UserAvatar from "@/src/components/ui/user-avatar";
import FollowButton from "@/src/components/social/follow-button";
import PostCard from "../feed/main-feed/post-card";
import Pagination from "@/src/components/ui/pagination";

const TABS: { id: SearchResultType; label: string }[] = [
  { id: "users", label: "People" },
  { id: "stores", label: "Stores" },
  { id: "posts", label: "Posts" },
  { id: "communities", label: "Communities" },
  { id: "hashtags", label: "Hashtags" },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [tab, setTab] = useState<SearchResultType>("users");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSearchByType(tab, { q, page, limit: 15 });
  const items = data?.items ?? [];

  const handleTabChange = (next: SearchResultType) => {
    setTab(next);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
          Search
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[30px] italic leading-none text-ink">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
      </div>

      <div className="inline-flex gap-0.5 rounded-xl bg-surface-2 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={`rounded-lg px-4 py-2.5 text-[13.5px] font-medium transition-all ${
              tab === t.id
                ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!q ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <Search className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-subtle">
            Use the search bar above to find people, stores, posts, communities, and hashtags.
          </p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <p className="text-[13.5px] text-subtle">No {tab} match &quot;{q}&quot;.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tab === "users" &&
            (items as SearchUser[]).map((user) => <UserResultRow key={user.id} user={user} />)}

          {tab === "stores" &&
            (items as SearchStore[]).map((store) => (
              <StoreResultRow key={store.id} store={store} />
            ))}

          {tab === "posts" &&
            (items as import("@/src/types/post").Post[]).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

          {tab === "communities" &&
            (items as Community[]).map((community) => (
              <CommunityResultRow key={community.id} community={community} />
            ))}

          {tab === "hashtags" &&
            (items as import("@/src/types/hashtag").Hashtag[]).map((hashtag) => (
              <Link
                key={hashtag.id}
                href={`/hashtags/${hashtag.tag}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Hash size={16} />
                </div>
                <p className="text-[14px] font-medium text-ink">#{hashtag.tag}</p>
              </Link>
            ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function UserResultRow({ user }: { user: SearchUser }) {
  const { data: isFollowingReal, isLoading } = useFollowStatus(user.id);

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-4">
      <Link href={`/users/${user.username ?? user.id}`} className="shrink-0">
        <UserAvatar name={user.name} src={user.avatar} size={44} />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/users/${user.username ?? user.id}`}
          className="truncate text-[14px] font-semibold text-ink hover:text-violet-600 dark:hover:text-violet-400"
        >
          {user.name}
        </Link>
        {user.username && (
          <p className="text-[12.5px] text-violet-600 dark:text-violet-400">@{user.username}</p>
        )}
        {user.bio && (
          <p className="mt-0.5 truncate text-[12.5px] text-muted">{user.bio}</p>
        )}
      </div>

      {!isLoading && (
        <UserFollowButton userId={user.id} initialIsFollowing={isFollowingReal ?? false} />
      )}
    </div>
  );
}

function StoreResultRow({ store }: { store: SearchStore }) {
  const location = [store.city, store.state].filter(Boolean).join(", ");

  return (
    <Link
      href={`/marketplace/seller/${store.slug}`}
      className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30"
    >
      {store.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={store.logo}
          alt={store.name}
          className="h-11 w-11 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
          <Store size={17} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
          <span className="truncate">{store.name}</span>
          {store.isVerified && <BadgeCheck size={15} className="shrink-0 text-violet-600 dark:text-violet-400" />}
        </p>
        {location && <p className="mt-0.5 truncate text-[12.5px] text-muted">{location}</p>}
      </div>
    </Link>
  );
}

function UserFollowButton({
  userId,
  initialIsFollowing,
}: {
  userId: string;
  initialIsFollowing: boolean;
}) {
  const { isFollowing, toggleFollow } = useToggleFollow(userId, initialIsFollowing);
  return <FollowButton isFollowing={isFollowing} onClick={toggleFollow} />;
}

function CommunityResultRow({ community }: { community: Community }) {
  const { isMember, toggleMembership, isToggling } = useToggleCommunityMembership(
    community.slug,
    community.isMember ?? false
  );

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-4">
      <Link href={`/communities/${community.slug}`} className="shrink-0">
        {community.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={community.icon}
            alt={community.name}
            className="h-11 w-11 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <Users2 size={17} />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/communities/${community.slug}`}
          className="truncate text-[14px] font-semibold text-ink hover:text-violet-600 dark:hover:text-violet-400"
        >
          {community.name}
        </Link>
        {community.description && (
          <p className="mt-0.5 truncate text-[12.5px] text-muted">
            {community.description}
          </p>
        )}
      </div>

      <button
        onClick={toggleMembership}
        disabled={isToggling}
        className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors disabled:opacity-50 ${
          isMember
            ? "border border-line-strong text-muted"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110"
        }`}
      >
        {isMember ? "Joined" : "Join"}
      </button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-[13.5px] text-subtle">
          Loading...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
