"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCheck, ChevronRight, Image as ImageIcon, Loader2, Send, X } from "lucide-react";

import { useConversations } from "@/src/hooks/use-conversations";
import { useMessages } from "@/src/hooks/use-messages";
import { useSendMessage } from "@/src/hooks/use-send-message";
import { useMarkConversationRead } from "@/src/hooks/use-mark-conversation-read";
import { useUploadFiles } from "@/src/hooks/use-upload-files";
import { useAuthStore } from "@/src/store/auth-store";
import { formatDayLabel, formatTimeOfDay, isSameDay } from "@/src/lib/date";
import { getSocket } from "@/src/lib/socket";
import { MessageThreadSkeleton } from "@/src/components/skeletons/conversation-list-skeleton";
import { Message, MessageMedia } from "@/src/types/conversation";
import UserAvatar from "@/src/components/ui/user-avatar";
import ImageLightbox from "@/src/components/ui/image-lightbox";

// Messages from the same sender land in one visual group when they're
// within this long of each other - matches the cadence of a real back-and-
// forth without gluing together things sent minutes apart.
const GROUP_GAP_MS = 5 * 60 * 1000;
const TEXTAREA_MAX_HEIGHT = 128;
const TYPING_EMIT_INTERVAL = 2000;
const TYPING_EXPIRY = 3000;

interface MessageItem {
  kind: "message";
  message: Message;
  isGroupStart: boolean;
  isGroupEnd: boolean;
}

interface SeparatorItem {
  kind: "separator";
  key: string;
  label: string;
}

function buildThreadItems(messages: Message[]): (MessageItem | SeparatorItem)[] {
  const items: (MessageItem | SeparatorItem)[] = [];

  messages.forEach((message, index) => {
    const prev = messages[index - 1];
    const next = messages[index + 1];

    if (!prev || !isSameDay(prev.createdAt, message.createdAt)) {
      items.push({
        kind: "separator",
        key: `separator-${message.id}`,
        label: formatDayLabel(message.createdAt),
      });
    }

    const closeTo = (a: Message, b: Message) =>
      a.senderId === b.senderId &&
      isSameDay(a.createdAt, b.createdAt) &&
      Math.abs(new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) < GROUP_GAP_MS;

    items.push({
      kind: "message",
      message,
      isGroupStart: !prev || !closeTo(prev, message),
      isGroupEnd: !next || !closeTo(message, next),
    });
  });

  return items;
}

export default function ConversationThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // Keyed by conversation id so switching threads remounts this component
  // fresh - the composer draft, typing state, and lightbox all reset for
  // free instead of needing a manual effect to sync each one.
  return <ConversationThread key={id} id={id} />;
}

function ConversationThread({ id }: { id: string }) {
  const router = useRouter();
  const currentUserId = useAuthStore((state) => state.user?.id);

  const { data: conversationsData } = useConversations({ limit: 50 });
  const conversation = conversationsData?.conversations.find((c) => c.id === id);

  const { data, isLoading } = useMessages(id, { limit: 50 });
  const messages = useMemo(() => [...(data?.messages ?? [])].reverse(), [data]);
  const threadItems = useMemo(() => buildThreadItems(messages), [messages]);

  const lastOwnMessage = useMemo(
    () => [...messages].reverse().find((m) => m.senderId === currentUserId),
    [messages, currentUserId]
  );

  const { mutate: sendMessage, isPending: isSending } = useSendMessage(id);
  const { mutate: markRead } = useMarkConversationRead();
  const { mutate: uploadFiles, isPending: isUploading } = useUploadFiles();

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MessageMedia[]>([]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [otherTyping, setOtherTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastTypingEmitRef = useRef(0);
  const typingExpiryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const otherParticipant =
    conversation?.otherParticipant ??
    messages.find((m) => m.senderId !== currentUserId)?.sender;

  useEffect(() => {
    markRead(id);
  }, [id, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, otherTyping]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [content]);

  useEffect(() => {
    const socket = getSocket();

    const handleTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== id) return;

      setOtherTyping(true);
      if (typingExpiryRef.current) clearTimeout(typingExpiryRef.current);
      typingExpiryRef.current = setTimeout(() => setOtherTyping(false), TYPING_EXPIRY);
    };

    socket.on("typing", handleTyping);
    return () => {
      socket.off("typing", handleTyping);
      if (typingExpiryRef.current) clearTimeout(typingExpiryRef.current);
    };
  }, [id]);

  const canSend = (content.trim().length > 0 || media.length > 0) && !isUploading;

  const handleContentChange = (value: string) => {
    setContent(value);

    // The server resolves who to relay this to from the conversation's real
    // participants (and confirms we're actually one of them) - we just say
    // which thread.
    const now = Date.now();
    if (now - lastTypingEmitRef.current > TYPING_EMIT_INTERVAL) {
      lastTypingEmitRef.current = now;
      getSocket().emit("typing", { conversationId: id });
    }
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

  const handleSend = () => {
    if (!canSend) return;

    sendMessage(
      { content: content.trim() || undefined, media: media.length > 0 ? media : undefined },
      {
        onSuccess: () => {
          setContent("");
          setMedia([]);
        },
      }
    );
  };

  const handleBack = () => {
    // Landed here with somewhere to return to (a seller profile, a user's
    // profile, a notification, etc.) - go back there instead of always
    // dropping the user on the conversation list. Falls back to the list
    // when there's no in-app history to unwind (a fresh tab, a direct link).
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/messages");
    }
  };

  const profileHref = otherParticipant
    ? `/users/${otherParticipant.username ?? otherParticipant.id}`
    : null;

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-2xl flex-col rounded-[28px] border border-[#ECE9F6] bg-gradient-to-b from-violet-50 to-indigo-50/70 px-5 pb-5 pt-5 sm:px-7">
      <div className="flex items-center gap-3 border-b border-[#ECE9F6] pb-4">
        <button
          onClick={handleBack}
          className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-white/70"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        {profileHref ? (
          <Link href={profileHref} className="group flex flex-1 items-center gap-3 min-w-0">
            <UserAvatar name={otherParticipant?.name} src={otherParticipant?.avatar} size={40} />
            <div className="min-w-0">
              <p className="truncate text-[14.5px] font-semibold text-[#13131A] group-hover:text-violet-700">
                {otherParticipant?.name ?? "Conversation"}
              </p>
              <p
                className={`text-[12px] transition-opacity ${
                  otherTyping ? "font-medium text-violet-600 animate-pulse" : "text-[#94A3B8] opacity-0"
                }`}
              >
                typing...
              </p>
            </div>
            <ChevronRight
              size={15}
              className="ml-auto shrink-0 text-[#C4C0DC] opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        ) : (
          <p className="text-[14.5px] font-semibold text-[#13131A]">Conversation</p>
        )}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto py-5">
        {isLoading ? (
          <MessageThreadSkeleton />
        ) : messages.length === 0 ? (
          <p className="text-center text-[13px] text-[#94A3B8]">
            Say hello to start the conversation.
          </p>
        ) : (
          threadItems.map((item) => {
            if (item.kind === "separator") {
              return (
                <div key={item.key} className="flex justify-center py-3">
                  <span className="rounded-full bg-[#F7F7FB] px-3 py-1 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[#94A3B8]">
                    {item.label}
                  </span>
                </div>
              );
            }

            const { message, isGroupStart, isGroupEnd } = item;
            const isMine = message.senderId === currentUserId;
            const hasMedia = !!message.media?.length;
            const showStatus = isMine && isGroupEnd && message.id === lastOwnMessage?.id;

            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"} ${
                  isGroupStart ? "pt-2.5" : ""
                }`}
              >
                <div className={`max-w-[75%] space-y-1 ${message.pending ? "opacity-60" : ""}`}>
                  {hasMedia && (
                    <div
                      className={`grid gap-1 overflow-hidden rounded-2xl ${
                        message.media!.length > 1 ? "grid-cols-2" : ""
                      }`}
                    >
                      {message.media!.map((mediaItem, index) =>
                        mediaItem.type === "VIDEO" ? (
                          <video
                            key={index}
                            src={mediaItem.url}
                            controls
                            className="max-h-72 w-full bg-black object-cover"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={index}
                            src={mediaItem.url}
                            alt="Attachment"
                            onClick={() => setLightboxSrc(mediaItem.url)}
                            className="max-h-72 w-full cursor-zoom-in object-cover"
                          />
                        )
                      )}
                    </div>
                  )}

                  {message.content && (
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                        isMine
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                          : "bg-[#F7F7FB] text-[#13131A]"
                      }`}
                    >
                      {message.content}
                    </div>
                  )}

                  {isGroupEnd && (
                    <div
                      className={`flex items-center gap-1 font-[family-name:var(--font-mono)] text-[10.5px] text-[#94A3B8] ${
                        isMine ? "justify-end" : ""
                      }`}
                    >
                      {message.pending ? (
                        <>
                          <Loader2 size={10} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>{formatTimeOfDay(message.createdAt)}</span>
                      )}
                      {showStatus && !message.pending && (
                        <>
                          <span>·</span>
                          {message.readAt ? (
                            <span className="flex items-center gap-0.5 text-violet-500">
                              <CheckCheck size={11} /> Read
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5">
                              <Check size={11} /> Delivered
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <ImageLightbox
        src={lightboxSrc ?? ""}
        alt="Attachment"
        open={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />

      <div className="border-t border-[#ECE9F6] pt-4">
        {(media.length > 0 || isUploading) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {media.map((item) => (
              <div
                key={item.url}
                className="group relative h-16 w-16 overflow-hidden rounded-xl bg-[#F7F7FB]"
              >
                {item.type === "VIDEO" ? (
                  <video src={item.url} className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="Attachment" className="h-full w-full object-cover" />
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
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F7F7FB]">
                <Loader2 size={16} className="animate-spin text-violet-600" />
              </div>
            )}
          </div>
        )}

        <div className="flex items-end gap-2">
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F6F3FF] hover:text-violet-600 disabled:opacity-50"
            aria-label="Attach photo or video"
          >
            <ImageIcon size={19} />
          </button>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="max-h-32 flex-1 resize-none rounded-3xl border border-[#ECE9F6] bg-[#F7F7FB] px-5 py-3 text-[14px] leading-relaxed text-[#13131A] outline-none transition-colors focus:border-violet-400 focus:bg-white"
          />
          <button
            onClick={handleSend}
            disabled={!canSend || isSending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
