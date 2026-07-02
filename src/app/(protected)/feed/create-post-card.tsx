"use client";

import {
  Image,
  PenSquare,
} from "lucide-react";

export default function CreatePostCard() {
  return (
    <button
      className="
      w-full
      rounded-[32px]
      bg-white/80
      backdrop-blur-xl
      border
      border-white/50
      shadow-xl
      p-6
      text-left
    "
    >
      <div className="flex gap-4">
        <div
          className="
          h-12
          w-12
          rounded-full
          bg-gradient-to-br
          from-violet-600
          to-indigo-600
        "
        />

        <div className="flex-1">
          <p
            className="
            text-gray-500
          "
          >
            What's happening today?
          </p>

          <div
            className="
            mt-5
            flex
            gap-5
            text-sm
            text-violet-600
          "
          >
            <div className="flex gap-2">
              <PenSquare size={18} />
              Post
            </div>

            <div className="flex gap-2">
              <Image size={18} />
              Photo
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}