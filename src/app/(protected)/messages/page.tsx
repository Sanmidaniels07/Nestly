"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, MessageCircle, Search, Video } from "lucide-react";

import { useConversations } from "@/src/hooks/use-conversations";
import { formatRelativeTime } from "@/src/lib/date";
import { ConversationListSkeleton } from "@/src/components/skeletons/conversation-list-skeleton";
import { Message } from "@/src/types/conversation";
import UserAvatar from "@/src/components/ui/user-avatar";

function lastMessagePreview(lastMessage: Message | null | undefined) {
  if (!lastMessage) return { icon: null, text: "No messages yet" };
  if (lastMessage.content) return { icon: null, text: lastMessage.content };

  const isVideo = lastMessage.media?.[0]?.type === "VIDEO";
  return {
    icon: isVideo ? Video : ImageIcon,
    text: isVideo ? "Video" : "Photo",
  };
}

export default function MessagesPage() {
  const { data, isLoading } = useConversations({ limit: 30 });
  const [search, setSearch] = useState("");

  const conversations = data?.conversations;
  const unreadTotal = (conversations ?? []).reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

  const filtered = useMemo(() => {
    const list = conversations ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter((c) => (c.otherParticipant?.name ?? "").toLowerCase().includes(query));
  }, [conversations, search]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
          {unreadTotal > 0 ? `${unreadTotal} unread` : "All caught up"}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[32px] italic leading-none text-[#13131A]">
          Messages
        </h1>
      </div>

      {!isLoading && !!conversations?.length && (
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="h-11 w-full rounded-full border border-[#ECE9F6] bg-white pl-11 pr-4 text-[13.5px] text-[#13131A] outline-none transition-colors focus:border-violet-300"
          />
        </div>
      )}

      {isLoading ? (
        <div className="overflow-hidden rounded-3xl border border-[#ECE9F6] bg-white">
          <ConversationListSkeleton count={5} />
        </div>
      ) : !conversations?.length ? (
        <div className="rounded-3xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">No conversations yet</p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Message someone from their profile to start chatting.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-[13.5px] text-[#94A3B8]">
          No conversations match &ldquo;{search}&rdquo;.
        </p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#ECE9F6] bg-white">
          {filtered.map((conversation) => {
            const preview = lastMessagePreview(conversation.lastMessage);
            const unread = !!conversation.unreadCount;

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="flex items-center gap-3.5 border-b border-[#F2F1F8] px-5 py-4 transition-colors last:border-b-0 hover:bg-[#FAFAFD]"
              >
                <UserAvatar
                  name={conversation.otherParticipant?.name}
                  src={conversation.otherParticipant?.avatar}
                  size={52}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-[14.5px] ${
                        unread ? "font-semibold text-[#13131A]" : "font-medium text-[#13131A]"
                      }`}
                    >
                      {conversation.otherParticipant?.name ?? "Unknown user"}
                    </p>
                    <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] text-[#94A3B8]">
                      {formatRelativeTime(conversation.updatedAt)}
                    </span>
                  </div>
                  <p
                    className={`mt-0.5 flex items-center gap-1 truncate text-[13px] ${
                      unread ? "font-medium text-[#334155]" : "text-[#94A3B8]"
                    }`}
                  >
                    {preview.icon && <preview.icon size={13} className="shrink-0" />}
                    {preview.text}
                  </p>
                </div>

                {unread && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-1.5 text-[11px] font-semibold text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
