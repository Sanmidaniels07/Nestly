"use client";

interface Hashtag {
  tag: string;
  posts: number;
}

const hashtags: Hashtag[] = [
  { tag: "#Tech", posts: 12400 },
  { tag: "#RemoteWork", posts: 8100 },
  { tag: "#Design", posts: 6700 },
  { tag: "#Startup", posts: 4300 },
];

function formatCount(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function TrendingHashtags() {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h3 className="text-[15px] font-semibold text-[#13131A]">Trending</h3>

      <div className="mt-4 space-y-0.5">
        {hashtags.map((item, index) => (
          <button
            key={item.tag}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[#F7F7FB]"
          >
            <span className="w-4 shrink-0 font-[family-name:var(--font-mono)] text-[12px] text-[#C4C0DC]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-violet-600">
                {item.tag}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                {formatCount(item.posts)} posts
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}