"use client";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import { usePosts } from "@/src/hooks/use-posts";
import { PostListSkeleton } from "@/src/components/skeletons/post-card-skeleton";

export default function FeedCenter() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts({ sort: "desc" });

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  return (
    <div className="space-y-6">
      <Stories />

      <CreatePostCard />

      {isLoading && <PostListSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center text-[14px] text-red-500">
          Couldn&apos;t load the feed. Please try again.
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center text-[14px] text-subtle">
          No posts yet. Be the first to share something.
        </div>
      )}

      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full rounded-2xl border border-line bg-surface py-3 text-[13.5px] font-medium text-violet-600 dark:text-violet-400 transition-colors hover:bg-surface-2 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
