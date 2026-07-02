"use client";

import { Post } from "@/src/mocks/post";
import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import Image from "next/image";

interface Props {
  post: Post;
}

export default function PostCard({
  post,
}: Props) {
  return (
    <article
      className="
      rounded-[32px]
      bg-white/80
      backdrop-blur-xl
      border
      border-white/50
      shadow-xl
      overflow-hidden
    "
    >
      <div className="p-6">
        <div
          className="
          flex
          items-center
          gap-4
        "
        >
          <img
            src={post.user.avatar}
            className="
            h-12
            w-12
            rounded-full
            object-cover
            "
          />

          <div>
            <h3
              className="
              font-semibold
            "
            >
              {post.user.name}
            </h3>

            <p
              className="
              text-sm
              text-gray-500
            "
            >
              {post.createdAt}
            </p>
          </div>
        </div>

        <p className="mt-5">
          {post.content}
        </p>
      </div>

      {post.image && (
        <div
          className="
          relative
          h-[350px]
        "
        >
          <Image
            fill
            src={post.image}
            alt=""
            className="object-cover"
          />
        </div>
      )}

      <div
        className="
        flex
        items-center
        justify-between
        p-6
        border-t
      "
      >
        <button
          className="
          flex
          gap-2
          items-center
        "
        >
          <Heart size={20} />
          {post.likes}
        </button>

        <button
          className="
          flex
          gap-2
          items-center
        "
        >
          <MessageCircle size={20} />
          {post.comments}
        </button>

        <button>
          <Share2 size={20} />
        </button>
      </div>
    </article>
  );
}