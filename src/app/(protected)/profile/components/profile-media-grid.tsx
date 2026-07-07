"use client";

import { ProfileMedia } from "@/src/mocks/profile-media";
import ProfileMediaCard from "./profile-media-card";

interface Props {
  media: ProfileMedia[];
  onSelect: (index: number) => void;
}

export default function ProfileMediaGrid({ media, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((item, index) => (
        <ProfileMediaCard key={item.id} media={item} onClick={() => onSelect(index)} />
      ))}
    </div>
  );
}