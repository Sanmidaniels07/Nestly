"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Eye,
  MoreHorizontal,
  Pin,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfilePostGallery from "./profile-post-gallery";
import { profile } from "@/src/mocks/profile";

export interface ProfilePost {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  pinned?: boolean;
  images?: string[];
}

interface Props {
  post: ProfilePost;
}

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function ProfilePostCard({ post }: Props) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-3.5">
            <div className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2px]">
              <div className="rounded-full bg-white p-[2px]">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-[#13131A]">
                  {profile.name}
                </h3>
                {post.pinned && (
                  <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">
                    <Pin size={10} />
                    Pinned
                  </span>
                )}
              </div>
              <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
                @{profile.username} · {post.createdAt}
              </p>
            </div>
          </div>

          <button
            className="rounded-full p-1.5 text-[#94A3B8] transition-colors hover:bg-gray-100 hover:text-[#334155]"
            aria-label="Post options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <p className="mt-4 text-[14.5px] leading-relaxed text-[#334155]">
          {post.content}
        </p>

        {post.images && post.images.length > 0 && (
          <div className="mt-4">
            <ProfilePostGallery images={post.images} />
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-[#F2F1F8] pt-4">
          <div className="flex items-center gap-5">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? "text-red-500" : "text-[#64748B] hover:text-red-500"
              }`}
            >
              <Heart
                size={18}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "scale-110" : ""}
              />
              <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
                {formatCount(likes)}
              </span>
            </button>

            <button className="flex items-center gap-1.5 text-[#64748B] transition-colors hover:text-violet-600">
              <MessageCircle size={18} />
              <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
                {formatCount(post.comments)}
              </span>
            </button>

            <button className="flex items-center gap-1.5 text-[#64748B] transition-colors hover:text-emerald-500">
              <Repeat2 size={18} />
              <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
                {formatCount(post.shares)}
              </span>
            </button>

            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <Eye size={18} />
              <span className="font-[family-name:var(--font-mono)] text-[12.5px]">
                {formatCount(post.views)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={bookmarked ? "text-violet-600" : "text-[#94A3B8] hover:text-violet-600"}
            aria-label="Bookmark"
          >
            <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}