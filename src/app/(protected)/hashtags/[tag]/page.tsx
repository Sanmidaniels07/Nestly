"use client";

import { use } from "react";
import { Hash } from "lucide-react";

import { usePostsByHashtag } from "@/src/hooks/use-posts-by-hashtag";
import PostCard from "../../feed/main-feed/post-card";

export default function HashtagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = use(params);
  const decodedTag = decodeURIComponent(tag);

  const { data, isLoading } = usePostsByHashtag(decodedTag, { limit: 20 });
  const posts = data?.posts ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 pt-6">
      <div>
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
          <Hash size={22} />
          <h1 className="font-[family-name:var(--font-fraunces)] text-[32px] italic leading-none text-ink">
            {decodedTag}
          </h1>
        </div>
        <p className="mt-2 font-[family-name:var(--font-mono)] text-[13px] text-subtle">
          {data?.total ?? 0} posts
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 px-8 py-16 text-center">
          <Hash className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-ink">
            No posts with #{decodedTag} yet
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
