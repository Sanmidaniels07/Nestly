"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Video, X } from "lucide-react";

import { useCreatePost } from "@/src/hooks/use-create-post";
import { useUploadFiles } from "@/src/hooks/use-upload-files";
import { useAuthStore } from "@/src/store/auth-store";
import { useProfile } from "@/src/hooks/use-profile";
import { PostMedia } from "@/src/types/post";
import UserAvatar from "@/src/components/ui/user-avatar";

export default function CreatePostCard() {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<PostMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createPost, isPending } = useCreatePost();
  const { mutate: uploadFiles, isPending: isUploading } = useUploadFiles();

  // A post needs text content, at least one image/video, or both — title
  // is always optional and never part of this gate.
  const canPost =
    (content.trim().length > 0 || media.length > 0) && !isUploading;

  const reset = () => {
    setTitle("");
    setContent("");
    setMedia([]);
    setExpanded(false);
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) return;

    uploadFiles(Array.from(files), {
      onSuccess: (response) => setMedia((prev) => [...prev, ...response.data]),
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (url: string) => {
    setMedia((prev) => prev.filter((item) => item.url !== url));
  };

  const handleSubmit = () => {
    if (!canPost) return;

    createPost(
      {
        title: title.trim() || undefined,
        content: content.trim() || undefined,
        ...(media.length > 0 && { media }),
      },
      { onSuccess: reset }
    );
  };

  return (
    <div className="rounded-2xl border border-[#EDEBF5] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)] sm:p-6">
      <div className="flex gap-4">
        <div className="mt-1">
          <UserAvatar name={profile?.name ?? user?.name} src={profile?.avatar} size={44} />
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

              {media.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {media.map((item) => (
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
                        onClick={() => removeMedia(item.url)}
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
            </div>
          )}

          {expanded && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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

              <div className="flex flex-wrap items-center gap-3">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
