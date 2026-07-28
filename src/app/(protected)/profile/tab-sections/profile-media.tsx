"use client";

import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";

import { usePosts } from "@/src/hooks/use-posts";
import { useAuthStore } from "@/src/store/auth-store";
import { formatRelativeTime } from "@/src/lib/date";
import type { ProfileMedia } from "@/src/types/profile-media";
import ProfileMediaFilter from "../components/profile-media-filter";
import ProfileMediaGrid from "../components/profile-media-grid";
import ProfileMediaLightbox from "../components/profile-media-box";

type Filter = "All" | "Photos" | "Videos";

export default function ProfileMedia() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const userId = useAuthStore((state) => state.user?.id);

  const { data, isLoading } = usePosts(
    { authorId: userId, sort: "desc" },
    { enabled: !!userId }
  );

  const allMedia = useMemo<ProfileMedia[]>(() => {
    const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

    return posts.flatMap((post) =>
      (post.media ?? []).map((item, index) => ({
        id: `${post.id}-${index}`,
        type: item.type === "VIDEO" ? "video" : "photo",
        image: item.url,
        likes: post.likeCount ?? 0,
        comments: 0,
        createdAt: formatRelativeTime(post.createdAt),
      }))
    );
  }, [data]);

  const media = useMemo(() => {
    if (filter === "All") return allMedia;
    if (filter === "Photos") return allMedia.filter((m) => m.type === "photo");
    return allMedia.filter((m) => m.type === "video");
  }, [allMedia, filter]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-10 text-center text-[14px] text-[#94A3B8]">
        Loading media...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileMediaFilter
        value={filter}
        onChange={(value) => {
          setFilter(value);
          setSelectedIndex(null);
        }}
      />

      {media.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <ImageOff className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">
            No {filter.toLowerCase()} yet
          </p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Media you share will show up here.
          </p>
        </div>
      ) : (
        <ProfileMediaGrid media={media} onSelect={setSelectedIndex} />
      )}

      <ProfileMediaLightbox
        media={media}
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    </div>
  );
}
