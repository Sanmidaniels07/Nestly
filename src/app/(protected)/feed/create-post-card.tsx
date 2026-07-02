"use client";

import { Image, PenSquare } from "lucide-react";

export default function CreatePostCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex-shrink-0" />

        <div className="flex-1">
          <button className="w-full text-left bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl px-6 py-4 text-gray-500">
            What's happening today?
          </button>

          <div className="mt-6 flex gap-6 text-sm text-violet-600">
            <button className="flex items-center gap-3 hover:text-violet-700 transition-colors">
              <PenSquare size={20} />
              <span className="font-medium">Post</span>
            </button>

            <button className="flex items-center gap-3 hover:text-violet-700 transition-colors">
              <Image size={20} />
              <span className="font-medium">Photo / Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}