"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Post } from "@/src/mocks/post";

interface Props {
  post: Post;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function PostCard({ post }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EDEBF5] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2px]">
            <div className="rounded-full bg-white p-[2px]">
              <Image
                src={post.user.avatar}
                alt={post.user.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-[#13131A]">
              {post.user.name}
            </h3>
            <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
              {post.createdAt}
            </p>
          </div>
        </div>

        <button
          className="rounded-full p-2 text-[#94A3B8] transition-colors hover:bg-gray-100 hover:text-[#334155]"
          aria-label="Post options"
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 pb-4 sm:px-6">
        <p className="text-[15.5px] leading-relaxed text-[#1E1B2E]">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative aspect-[4/3] bg-[#F7F7FB] sm:aspect-[16/10]">
          <Image
            fill
            src={post.image}
            alt=""
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-[#F2F1F8] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLike}
            className={`
              flex items-center gap-2 transition-colors
              ${liked ? "text-red-500" : "text-[#64748B] hover:text-red-500"}
            `}
          >
            <Heart
              size={21}
              className={`transition-transform ${liked ? "scale-110" : ""}`}
              fill={liked ? "currentColor" : "none"}
            />
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium">
              {formatCount(likeCount)}
            </span>
          </button>

          <button className="flex items-center gap-2 text-[#64748B] transition-colors hover:text-violet-600">
            <MessageCircle size={21} />
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium">
              {formatCount(post.comments)}
            </span>
          </button>
        </div>

        <button className="text-[#64748B] transition-colors hover:text-emerald-500">
          <Share2 size={20} />
        </button>
      </div>
    </article>
  );
}