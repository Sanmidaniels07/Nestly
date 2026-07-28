"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

import { useConversations } from "@/src/hooks/use-conversations";
import { useMessages } from "@/src/hooks/use-messages";
import { useSendMessage } from "@/src/hooks/use-send-message";
import { useMarkConversationRead } from "@/src/hooks/use-mark-conversation-read";
import { useAuthStore } from "@/src/store/auth-store";
import { formatRelativeTime } from "@/src/lib/date";

export default function ConversationThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const { data: conversationsData } = useConversations({ limit: 50 });
  const conversation = conversationsData?.conversations.find((c) => c.id === id);

  const { data, isLoading } = useMessages(id, { limit: 50 });
  const messages = useMemo(() => [...(data?.messages ?? [])].reverse(), [data]);

  const { mutate: sendMessage, isPending: isSending } = useSendMessage(id);
  const { mutate: markRead } = useMarkConversationRead();

  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markRead(id);
  }, [id, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const otherParticipant =
    conversation?.otherParticipant ??
    messages.find((m) => m.senderId !== currentUserId)?.sender;

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    sendMessage(trimmed, { onSuccess: () => setContent("") });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-2xl flex-col pt-6">
      <div className="flex items-center gap-3 border-b border-[#ECE9F6] pb-4">
        <Link
          href="/messages"
          className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-gray-100"
          aria-label="Back to messages"
        >
          <ArrowLeft size={18} />
        </Link>

        {otherParticipant?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={otherParticipant.avatar}
            alt={otherParticipant.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-[14px] font-semibold text-white">
            {otherParticipant?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}

        <p className="text-[14.5px] font-semibold text-[#13131A]">
          {otherParticipant?.name ?? "Conversation"}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-5">
        {isLoading ? (
          <p className="text-center text-[13px] text-[#94A3B8]">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-[13px] text-[#94A3B8]">
            Say hello to start the conversation.
          </p>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUserId;

            return (
              <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                    isMine
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                      : "bg-[#F7F7FB] text-[#13131A]"
                  }`}
                >
                  {message.content}
                  <p
                    className={`mt-1 font-[family-name:var(--font-mono)] text-[10.5px] ${
                      isMine ? "text-violet-100" : "text-[#94A3B8]"
                    }`}
                  >
                    {formatRelativeTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-[#ECE9F6] pt-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="h-12 flex-1 rounded-full border border-[#ECE9F6] bg-[#F7F7FB] px-5 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400 focus:bg-white"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
