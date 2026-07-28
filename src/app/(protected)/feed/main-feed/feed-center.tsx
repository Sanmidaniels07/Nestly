"use client";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import { usePosts } from "@/src/hooks/use-posts";

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

      {isLoading && (
        <div className="rounded-2xl border border-[#EDEBF5] bg-white p-10 text-center text-[14px] text-[#94A3B8]">
          Loading posts...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-[#EDEBF5] bg-white p-10 text-center text-[14px] text-red-500">
          Couldn&apos;t load the feed. Please try again.
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="rounded-2xl border border-[#EDEBF5] bg-white p-10 text-center text-[14px] text-[#94A3B8]">
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
          className="w-full rounded-2xl border border-[#EDEBF5] bg-white py-3 text-[13.5px] font-medium text-violet-600 transition-colors hover:bg-[#F7F7FB] disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
