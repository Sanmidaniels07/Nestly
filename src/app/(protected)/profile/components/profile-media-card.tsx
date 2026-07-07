"use client";

import Image from "next/image";
import { Heart, MessageCircle, Play } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileMedia } from "@/src/mocks/profile-media";

interface Props {
  media: ProfileMedia;
  onClick: () => void;
}

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function ProfileMediaCard({ media, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#ECE9F6]"
    >
      <Image
        src={media.image}
        alt=""
        width={600}
        height={600}
        className="aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {media.type === "video" && (
        <div className="absolute left-3 top-3 rounded-full bg-black/55 p-1.5 text-white backdrop-blur-sm">
          <Play size={13} fill="white" />
        </div>
      )}

      <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] text-white/90">
          {media.createdAt}
        </span>
      </div>

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex w-full items-center gap-4 p-4 text-white">
          <div className="flex items-center gap-1.5">
            <Heart size={15} fill="white" />
            <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
              {formatCount(media.likes)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <MessageCircle size={15} />
            <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
              {formatCount(media.comments)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}