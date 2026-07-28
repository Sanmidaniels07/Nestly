"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Send, Trash2, X } from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import { useCreateConversation } from "@/src/hooks/use-create-conversation";
import { useSendMessage } from "@/src/hooks/use-send-message";
import { useDeleteStory } from "@/src/hooks/use-delete-story";
import { useReactToStory } from "@/src/hooks/use-react-to-story";
import { useRemoveStoryReaction } from "@/src/hooks/use-remove-story-reaction";
import { useStoryViewers } from "@/src/hooks/use-story-viewers";
import { getStory } from "@/src/services/story.services";
import { StoryAuthorGroup } from "@/src/types/story";

const STORY_DURATION_MS = 5000;
const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "👏"];

interface Props {
  groups: StoryAuthorGroup[];
  initialGroupIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ groups, initialGroupIndex, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState("");
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [viewersOpen, setViewersOpen] = useState(false);

  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setMounted(true), []);

  const group = groups[groupIndex];
  const story = group?.stories[storyIndex];
  const isOwn = group?.author.id === currentUserId;

  const { mutate: createConversation, isPending: isSendingReply } = useCreateConversation();
  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory();
  const { mutate: reactToStory } = useReactToStory(story?.id ?? "");
  const { mutate: removeReaction } = useRemoveStoryReaction(story?.id ?? "");
  const { data: viewersData } = useStoryViewers(story?.id ?? "", { limit: 50 }, isOwn);

  const goNext = () => {
    if (!group) return;

    if (storyIndex < group.stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setProgress(0);
      return;
    }

    if (groupIndex < groups.length - 1) {
      setGroupIndex((g) => g + 1);
      setStoryIndex(0);
      setProgress(0);
      return;
    }

    handleClose();
  };

  const goPrev = () => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      setProgress(0);
      return;
    }

    if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1];
      setGroupIndex((g) => g - 1);
      setStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    queryClient.invalidateQueries({ queryKey: ["stories", "feed"] });
    onClose();
  };

  // Reset per-story local state whenever the displayed story changes, and
  // record the view server-side (the by-id endpoint upserts a StoryView as
  // a side effect for anyone but the author).
  useEffect(() => {
    if (!story) return;

    setMyReaction(null);
    setReply("");
    setViewersOpen(false);

    if (!isOwn) {
      getStory(story.id).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

  // Auto-advance progress for image stories. Video stories drive progress
  // off their own playback instead (see the <video> element below).
  useEffect(() => {
    if (!story || story.mediaType === "VIDEO" || paused) return;

    const start = Date.now() - progress * (STORY_DURATION_MS / 100);
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / STORY_DURATION_MS) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        goNext();
      }
    }, 50);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, paused]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex, storyIndex, groups]);

  const progressSegments = useMemo(() => group?.stories.map((s) => s.id) ?? [], [group]);

  const handleReact = (emoji: string) => {
    if (myReaction === emoji) {
      setMyReaction(null);
      removeReaction();
    } else {
      setMyReaction(emoji);
      reactToStory(emoji);
    }
  };

  const handleReply = () => {
    if (!reply.trim() || !group) return;

    createConversation(group.author.id, {
      onSuccess: (response) => {
        const conversationId = response.data.id;
        sendMessage(reply.trim(), conversationId);
      },
    });
  };

  // useSendMessage is keyed by conversation id, so it's created fresh once
  // we actually have one to reply into.
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { mutate: sendMessageMutate } = useSendMessage(activeConversationId ?? "");

  function sendMessage(content: string, conversationId: string) {
    setActiveConversationId(conversationId);
    sendMessageMutate(content, {
      onSuccess: () => setReply(""),
    });
  }

  if (!mounted || !group || !story) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <button
        onClick={handleClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      <div className="relative flex h-full w-full max-w-md flex-col sm:h-[92vh] sm:rounded-2xl sm:shadow-2xl">
        {/* Progress bars */}
        <div className="absolute left-0 right-0 top-0 z-20 flex gap-1.5 p-3">
          {progressSegments.map((id, index) => (
            <div key={id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white transition-[width] duration-75 ease-linear"
                style={{
                  width:
                    index < storyIndex ? "100%" : index === storyIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Author row */}
        <div className="absolute left-0 right-0 top-6 z-20 flex items-center justify-between px-3 pt-2">
          <button
            onClick={() => router.push(`/users/${group.author.username ?? group.author.id}`)}
            className="flex items-center gap-2.5"
          >
            {group.author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={group.author.avatar}
                alt={group.author.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/50"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-[13px] font-semibold text-white ring-2 ring-white/50">
                {group.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[13.5px] font-semibold text-white">{group.author.name}</span>
          </button>

          {isOwn && (
            <button
              onClick={() => deleteStory(story.id, { onSuccess: goNext })}
              disabled={isDeleting}
              aria-label="Delete story"
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-red-500/80 disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Media + tap zones */}
        <div className="relative flex-1 bg-black">
          {story.mediaType === "VIDEO" ? (
            <video
              ref={videoRef}
              src={story.mediaUrl}
              autoPlay
              className="h-full w-full object-contain"
              onTimeUpdate={(e) => {
                const video = e.currentTarget;
                if (video.duration) setProgress((video.currentTime / video.duration) * 100);
              }}
              onEnded={goNext}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={story.mediaUrl} alt="" className="h-full w-full object-contain" />
          )}

          <button
            aria-label="Previous story"
            onClick={goPrev}
            onMouseDown={() => setPaused(true)}
            onMouseUp={() => setPaused(false)}
            className="absolute left-0 top-0 h-full w-1/3"
          />
          <button
            aria-label="Next story"
            onClick={goNext}
            onMouseDown={() => setPaused(true)}
            onMouseUp={() => setPaused(false)}
            className="absolute right-0 top-0 h-full w-1/3"
          />

          {story.caption && (
            <p className="absolute bottom-24 left-0 right-0 px-5 text-center text-[14.5px] text-white drop-shadow-lg">
              {story.caption}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="z-20 bg-gradient-to-t from-black/80 to-transparent px-4 pb-5 pt-3">
          {isOwn ? (
            <button
              onClick={() => setViewersOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-white/90"
            >
              <Eye size={15} />
              {viewersData?.total ?? 0} view{viewersData?.total === 1 ? "" : "s"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className={`text-[18px] transition-transform hover:scale-125 ${
                      myReaction === emoji ? "scale-125" : "opacity-80"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                  placeholder="Reply..."
                  className="flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/60"
                />
              </div>
              <button
                onClick={handleReply}
                disabled={!reply.trim() || isSendingReply}
                aria-label="Send reply"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>

        {isOwn && viewersOpen && (
          <div className="absolute bottom-0 left-0 right-0 z-30 max-h-[50%] overflow-y-auto rounded-t-2xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#13131A]">Viewers</h3>
              <button
                onClick={() => setViewersOpen(false)}
                className="rounded-full p-1.5 text-[#94A3B8] hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {(viewersData?.views ?? []).map((view) => (
                <div key={view.id} className="flex items-center gap-2.5">
                  {view.viewer.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={view.viewer.avatar}
                      alt={view.viewer.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-[11px] font-semibold text-white">
                      {view.viewer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[13px] font-medium text-[#13131A]">
                    {view.viewer.name}
                  </span>
                </div>
              ))}

              {viewersData?.views.length === 0 && (
                <p className="text-[13px] text-[#94A3B8]">No views yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
