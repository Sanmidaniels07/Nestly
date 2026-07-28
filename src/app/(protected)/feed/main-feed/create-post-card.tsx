"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useCreatePost } from "@/src/hooks/use-create-post";
import { useAuthStore } from "@/src/store/auth-store";
import UserAvatar from "@/src/components/ui/user-avatar";

export default function CreatePostCard() {
  const user = useAuthStore((state) => state.user);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: createPost, isPending } = useCreatePost();

  const canPost = title.trim().length > 0 && content.trim().length > 0;

  const reset = () => {
    setTitle("");
    setContent("");
    setExpanded(false);
  };

  const handleSubmit = () => {
    if (!canPost) return;

    createPost(
      { title: title.trim(), content: content.trim() },
      { onSuccess: reset }
    );
  };

  return (
    <div className="rounded-2xl border border-[#EDEBF5] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)] sm:p-6">
      <div className="flex gap-4">
        <div className="mt-1">
          <UserAvatar name={user?.name} size={44} />
        </div>

        <div className="flex-1">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full rounded-2xl bg-[#F7F7FB] px-5 py-3.5 text-left text-[15px] text-[#94A3B8] transition-colors hover:bg-[#F0EFF9]"
            >
              What&apos;s happening today?
            </button>
          ) : (
            <div className="space-y-2">
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a title"
                maxLength={120}
                className="w-full rounded-xl bg-[#F7F7FB] px-5 py-2.5 text-[14px] font-medium text-[#13131A] outline-none placeholder:text-[#94A3B8] focus:bg-[#F0EFF9]"
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening today?"
                rows={3}
                maxLength={2000}
                className="w-full resize-none rounded-2xl bg-[#F7F7FB] px-5 py-3.5 text-[15px] text-[#13131A] outline-none placeholder:text-[#94A3B8] focus:bg-[#F0EFF9]"
              />
            </div>
          )}

          {expanded && (
            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
              <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                {content.length}/2000
              </span>
              <button
                onClick={reset}
                className="rounded-full p-1.5 text-[#94A3B8] transition-colors hover:bg-gray-100"
                aria-label="Cancel"
              >
                <X size={16} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canPost || isPending}
                className="
          rounded-full bg-gradient-to-r from-violet-600 to-indigo-600
          px-5 py-2 text-[13px] font-semibold text-white
          transition-all hover:brightness-110
          disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100
        "
              >
                {isPending ? "Posting..." : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
