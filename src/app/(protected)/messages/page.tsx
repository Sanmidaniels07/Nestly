"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { useConversations } from "@/src/hooks/use-conversations";
import { formatRelativeTime } from "@/src/lib/date";

export default function MessagesPage() {
  const { data, isLoading } = useConversations({ limit: 30 });
  const conversations = data?.conversations ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 pt-6">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[36px] italic leading-none text-[#13131A]">
          Messages
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#64748B]">Your conversations.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">No conversations yet</p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Message someone from their profile to start chatting.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="flex items-center gap-3.5 rounded-2xl border border-[#EDEBF5] bg-white p-4 transition-colors hover:border-violet-200"
            >
              {conversation.otherParticipant?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={conversation.otherParticipant.avatar}
                  alt={conversation.otherParticipant.name}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-[16px] font-semibold text-white">
                  {conversation.otherParticipant?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[14px] font-semibold text-[#13131A]">
                    {conversation.otherParticipant?.name ?? "Unknown user"}
                  </p>
                  <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                    {formatRelativeTime(conversation.updatedAt)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
                  {conversation.lastMessage?.content ?? "No messages yet"}
                </p>
              </div>

              {!!conversation.unreadCount && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[11px] font-semibold text-white">
                  {conversation.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
