"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { useComments } from "@/src/hooks/use-comments";
import { useCreateComment } from "@/src/hooks/use-create-comment";
import { useDeleteComment } from "@/src/hooks/use-delete-comment";
import { useAuthStore } from "@/src/store/auth-store";
import { AuthorAvatarLink, AuthorNameLink } from "@/src/components/social/author-link";
import { formatRelativeTime } from "@/src/lib/date";
import Skeleton from "@/src/components/ui/skeleton";

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useComments(postId);
  const { mutate: createComment, isPending: isPosting } =
    useCreateComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createComment(content.trim(), {
      onSuccess: () => setContent(""),
    });
  };

  return (
    <div className="border-t border-[#F2F1F8] px-5 py-4 sm:px-6">
      <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          maxLength={500}
          className="flex-1 rounded-full bg-[#F7F7FB] px-4 py-2 text-[13.5px] text-[#13131A] outline-none placeholder:text-[#94A3B8] focus:bg-[#F0EFF9]"
        />
        <button
          type="submit"
          disabled={!content.trim() || isPosting}
          className="rounded-full bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPosting ? "..." : "Send"}
        </button>
      </form>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <Skeleton className="h-12 flex-1 rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && comments?.length === 0 && (
        <p className="text-[13px] text-[#94A3B8]">
          No comments yet. Be the first to comment.
        </p>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <AuthorAvatarLink author={comment.user} size={32} />

            <div className="flex-1 rounded-2xl bg-[#F7F7FB] px-4 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-[#13131A]">
                  <AuthorNameLink author={comment.user} />
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#94A3B8]">
                    {formatRelativeTime(comment.createdAt)}
                  </span>

                  {comment.userId === currentUserId && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      aria-label="Delete comment"
                      className="text-[#94A3B8] transition-colors hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-0.5 text-[13.5px] text-[#334155]">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
