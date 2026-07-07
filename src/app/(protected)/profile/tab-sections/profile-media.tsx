"use client";

import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";

import ProfileMediaFilter from "../components/profile-media-filter";
import ProfileMediaGrid from "../components/profile-media-grid";
import { profileMedia } from "@/src/mocks/profile-media";
import ProfileMediaLightbox from "../components/profile-media-box";

type Filter = "All" | "Photos" | "Videos";

export default function ProfileMedia() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const media = useMemo(() => {
    if (filter === "All") return profileMedia;
    if (filter === "Photos") return profileMedia.filter((m) => m.type === "photo");
    return profileMedia.filter((m) => m.type === "video");
  }, [filter]);

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