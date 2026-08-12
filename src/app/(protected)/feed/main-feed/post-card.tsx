"use client";

import { useRef, useState } from "react";
import {
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Video,
  X,
} from "lucide-react";

import { Post, PostMedia } from "@/src/types/post";
import { usePostLikes } from "@/src/hooks/use-post-likes";
import { useComments } from "@/src/hooks/use-comments";
import { useUpdatePost } from "@/src/hooks/use-update-post";
import { useDeletePost } from "@/src/hooks/use-delete-post";
import { useUploadFiles } from "@/src/hooks/use-upload-files";
import { useClickOutside } from "@/src/hooks/use-click-outside";
import { useAuthStore } from "@/src/store/auth-store";
import { AuthorAvatarLink, AuthorNameLink } from "@/src/components/social/author-link";
import ReportButton from "@/src/components/ui/report-button";
import { formatRelativeTime } from "@/src/lib/date";
import CommentSection from "./comment-section";

interface Props {
  post: Post;
  autoOpenComments?: boolean;
}

function formatCount(n: number | undefined | null) {
  const value = n ?? 0;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function PostCard({ post, autoOpenComments }: Props) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isAuthor = post.authorId === currentUserId;

  const { count: likeCount, isLiked, toggleLike, isToggling } = usePostLikes(
    post.id,
    { count: post.likeCount ?? 0, likedByMe: post.likedByMe ?? false }
  );
  const { data: comments } = useComments(post.id);

  const { mutate: updatePost, isPending: isSaving } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: uploadFiles, isPending: isUploading } = useUploadFiles();

  const [menuOpen, setMenuOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(!!autoOpenComments);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content ?? "");
  const [editMedia, setEditMedia] = useState<PostMedia[]>(post.media ?? []);

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const hasMedia = !!post.media && post.media.length > 0;

  const startEditing = () => {
    setEditContent(post.content ?? "");
    setEditMedia(post.media ?? []);
    setIsEditing(true);
    setMenuOpen(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditContent(post.content ?? "");
    setEditMedia(post.media ?? []);
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) return;

    uploadFiles(Array.from(files), {
      onSuccess: (response) => setEditMedia((prev) => [...prev, ...response.data]),
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeEditMedia = (url: string) => {
    setEditMedia((prev) => prev.filter((item) => item.url !== url));
  };

  const handleSave = () => {
    
    if (!editContent.trim() && editMedia.length === 0) return;
    if (isUploading) return;

    updatePost(
      {
        id: post.id,
        data: {
          content: editContent.trim(),
       
          media: editMedia,
        },
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (confirm("Delete this post?")) {
      deletePost(post.id);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EDEBF5] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 sm:p-6">
        <div className="flex items-center gap-3.5">
          <AuthorAvatarLink author={post.author} size={44} />

          <div>
            <h3 className="text-[15px] font-semibold text-[#13131A]">
              <AuthorNameLink author={post.author} />
            </h3>
            <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-full p-2 text-[#94A3B8] transition-colors hover:bg-gray-100 hover:text-[#334155]"
            aria-label="Post options"
          >
            <MoreHorizontal size={19} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-10 w-40 overflow-hidden rounded-xl border border-[#ECE9F6] bg-white shadow-lg">
              {isAuthor ? (
                <>
                  <button
                    onClick={startEditing}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px] text-[#334155] hover:bg-[#F7F7FB]"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleDelete();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              ) : (
                <ReportButton
                  targetType="POST"
                  targetId={post.id}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px] text-[#334155] hover:bg-[#F7F7FB]"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4 sm:px-6">
        {post.title && (
          <h4 className="mb-1 text-[15px] font-semibold text-[#13131A]">
            {post.title}
          </h4>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl bg-[#F7F7FB] px-4 py-3 text-[15px] text-[#13131A] outline-none focus:bg-[#F0EFF9]"
            />

            {editMedia.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {editMedia.map((item) => (
                  <div
                    key={item.url}
                    className="group relative h-20 w-20 overflow-hidden rounded-xl bg-[#F7F7FB]"
                  >
                    {item.type === "VIDEO" ? (
                      <video src={item.url} className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.url}
                        alt="Attachment"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      onClick={() => removeEditMedia(item.url)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove attachment"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {isUploading && (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#F7F7FB]">
                    <Loader2 size={18} className="animate-spin text-violet-600" />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  hidden
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-full p-2 text-[#94A3B8] transition-colors hover:bg-[#F6F3FF] hover:text-violet-600 disabled:opacity-50"
                  aria-label="Attach photo"
                >
                  <ImageIcon size={18} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-full p-2 text-[#94A3B8] transition-colors hover:bg-[#F6F3FF] hover:text-violet-600 disabled:opacity-50"
                  aria-label="Attach video"
                >
                  <Video size={18} />
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelEditing}
                  className="rounded-full px-4 py-1.5 text-[13px] font-medium text-[#64748B] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="rounded-full bg-violet-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          post.content && (
            <p className="text-[15.5px] leading-relaxed text-[#1E1B2E]">
              {post.content}
            </p>
          )
        )}

        {!isEditing && post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
            {post.hashtags.map((tag) => (
              <span key={tag} className="text-[13.5px] font-medium text-violet-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {!isEditing && post.media && post.media.length > 0 && (
          <div
            className={`mt-3 grid gap-1.5 overflow-hidden rounded-2xl ${
              post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {post.media.map((item, index) =>
              item.type === "VIDEO" ? (
                <video
                  key={index}
                  src={item.url}
                  controls
                  className="max-h-[420px] w-full bg-black object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={index}
                  src={item.url}
                  alt="Post attachment"
                  className="max-h-[420px] w-full object-cover"
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-[#F2F1F8] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLike}
            disabled={isToggling}
            className={`
              flex items-center gap-2 transition-colors
              ${isLiked ? "text-red-500" : "text-[#64748B] hover:text-red-500"}
            `}
          >
            <Heart
              size={21}
              className={`transition-transform ${isLiked ? "scale-110" : ""}`}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium">
              {formatCount(likeCount)}
            </span>
          </button>

          <button
            onClick={() => setCommentsOpen((prev) => !prev)}
            className="flex items-center gap-2 text-[#64748B] transition-colors hover:text-violet-600"
          >
            <MessageCircle size={21} />
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium">
              {formatCount(comments?.length ?? 0)}
            </span>
          </button>
        </div>
      </div>

      {commentsOpen && <CommentSection postId={post.id} />}
    </article>
  );
}