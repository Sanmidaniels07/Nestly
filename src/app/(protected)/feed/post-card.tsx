"use client";

import { Post } from "@/src/mocks/post";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <article className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 p-6">
        <img
          src={post.user.avatar}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
          alt={post.user.name}
        />
        <div>
          <h3 className="font-semibold text-lg">{post.user.name}</h3>
          <p className="text-sm text-gray-500">{post.createdAt}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-[17px] leading-relaxed text-gray-800">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative aspect-video bg-gray-100">
          <Image
            fill
            src={post.image}
            alt=""
            className="object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-6 py-5 border-t">
        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
          <Heart size={22} />
          <span className="font-medium">{post.likes}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
          <MessageCircle size={22} />
          <span className="font-medium">{post.comments}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-500 transition-colors">
          <Share2 size={22} />
        </button>
      </div>
    </article>
  );
}