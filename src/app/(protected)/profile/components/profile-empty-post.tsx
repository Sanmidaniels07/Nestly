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

  // This composer doesn't offer media attachment, so content is the only
  // way to satisfy "text, media, or both" here — title stays optional.
  const canPost = content.trim().length > 0;

  const handleSubmit = () => {
    if (!canPost) return;

    createPost(
      { title: title.trim() || undefined, content: content.trim() || undefined },
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
      <div className="rounded-2xl border border-dashed border-violet-200 dark:border-violet-500/30 bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-ink">
            Create your first post
          </h2>
          <button
            onClick={() => setComposing(false)}
            aria-label="Cancel"
            className="rounded-full p-1.5 text-subtle transition-colors hover:bg-surface-muted"
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
            className="w-full rounded-xl bg-surface-2 px-4 py-2.5 text-[14px] font-medium text-ink outline-none placeholder:text-subtle focus:bg-surface-muted"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening today?"
            rows={4}
            maxLength={2000}
            className="w-full resize-none rounded-2xl bg-surface-2 px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-subtle focus:bg-surface-muted"
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
    <div className="rounded-2xl border border-dashed border-violet-200 dark:border-violet-500/30 bg-surface py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
        <PenSquare size={26} className="text-violet-600 dark:text-violet-400" />
      </div>

      <h2 className="text-[19px] font-semibold text-ink">
        No posts yet
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">
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
