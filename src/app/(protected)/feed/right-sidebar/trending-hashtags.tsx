"use client";

import Link from "next/link";
import { useTrendingHashtags } from "@/src/hooks/use-trending-hashtags";

function formatCount(n?: number) {
  const value = n ?? 0;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function TrendingHashtags() {
  const { data: trending, isLoading } = useTrendingHashtags(4);

  if (!isLoading && !trending?.length) return null;

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h3 className="text-[15px] font-semibold text-[#13131A]">Trending</h3>

      <div className="mt-4 space-y-0.5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F7F7FB]" />
            ))
          : trending?.map((item, index) => (
              <Link
                key={item.hashtag.id}
                href={`/hashtags/${item.hashtag.tag}`}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[#F7F7FB]"
              >
                <span className="w-4 shrink-0 font-[family-name:var(--font-mono)] text-[12px] text-[#C4C0DC]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-violet-600">
                    #{item.hashtag.tag}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                    {formatCount(item.postCount)} posts
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
