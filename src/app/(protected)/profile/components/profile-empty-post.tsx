"use client";

import { useState } from "react";
import { PenSquare, X } from "lucide-react";
import Button from "@/src/components/ui/button";
import { useCreatePost } from "@/src/hooks/use-create-post";

export default function ProfileEmptyPost() {
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: createPost, isPending } = useCreatePost();

  const canPost = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canPost) return;

    createPost(
      { title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setComposing(false);
        },
      }
    );
  };

  if (composing) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#13131A]">
            Create your first post
          </h2>
          <button
            onClick={() => setComposing(false)}
            aria-label="Cancel"
            className="rounded-full p-1.5 text-[#94A3B8] transition-colors hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title"
            maxLength={120}
            className="w-full rounded-xl bg-[#F7F7FB] px-4 py-2.5 text-[14px] font-medium text-[#13131A] outline-none placeholder:text-[#94A3B8] focus:bg-[#F0EFF9]"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening today?"
            rows={4}
            maxLength={2000}
            className="w-full resize-none rounded-2xl bg-[#F7F7FB] px-4 py-3.5 text-[15px] text-[#13131A] outline-none placeholder:text-[#94A3B8] focus:bg-[#F0EFF9]"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="tribely"
            disabled={!canPost || isPending}
            onClick={handleSubmit}
            className="w-fit"
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-violet-200 bg-white py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
        <PenSquare size={26} className="text-violet-600" />
      </div>

      <h2 className="text-[19px] font-semibold text-[#13131A]">
        No posts yet
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-[14px] text-[#64748B]">
        Your posts will appear here once you begin sharing updates with your community.
      </p>

      <Button
        onClick={() => setComposing(true)}
        className="mx-auto mt-7 w-fit"
        variant="tribely"
      >
        Create first post
      </Button>
    </div>
  );
}
