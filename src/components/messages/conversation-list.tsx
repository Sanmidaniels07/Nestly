"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, CheckCheck, MessageCircle, Search, Store } from "lucide-react";

import { useConversations } from "@/src/hooks/use-conversations";
import { useAuthStore } from "@/src/store/auth-store";
import { getSocket } from "@/src/lib/socket";
import { messageSummary, shortTime } from "@/src/lib/chat";
import { ConversationListSkeleton } from "@/src/components/skeletons/conversation-list-skeleton";
import UserAvatar from "@/src/components/ui/user-avatar";

const TYPING_EXPIRY = 3000;

// Chats, newest first: search, All / Unread, who's online, who's typing.
export default function ConversationList() {
  const pathname = usePathname();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data, isLoading } = useConversations({ limit: 50 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typing, setTyping] = useState<Record<string, number>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // "typing…" in the list, cleared a few seconds after the last keystroke.
  useEffect(() => {
    const socket = getSocket();
    const pending = timers.current;
    const onTyping = ({ conversationId }: { conversationId: string }) => {
      setTyping((prev) => ({ ...prev, [conversationId]: Date.now() }));
      clearTimeout(pending[conversationId]);
      pending[conversationId] = setTimeout(
        () =>
          setTyping((prev) => {
            const next = { ...prev };
            delete next[conversationId];
            return next;
          }),
        TYPING_EXPIRY
      );
    };
    socket.on("typing", onTyping);
    return () => {
      socket.off("typing", onTyping);
      Object.values(pending).forEach(clearTimeout);
    };
  }, []);

  const conversations = useMemo(() => data?.conversations ?? [], [data]);
  const unreadTotal = conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter(
      (c) =>
        (filter === "all" || (c.unreadCount ?? 0) > 0) &&
        (!query ||
          (c.otherParticipant?.name ?? "").toLowerCase().includes(query) ||
          (c.otherParticipant?.store?.name ?? "").toLowerCase().includes(query))
    );
  }, [conversations, search, filter]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-3 px-4 pb-3 pt-4 sm:px-5">
        <div className="flex items-end justify-between gap-3">
          <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] italic leading-none text-ink">Chats</h1>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {unreadTotal > 0 ? `${unreadTotal} unread` : "All caught up"}
          </p>
        </div>

        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="h-10 w-full rounded-full border border-line bg-surface-2 pl-10 pr-4 text-[16px] text-ink outline-none transition-colors focus:border-violet-400 focus:bg-surface sm:text-[13.5px]"
          />
        </div>

        <div className="flex gap-1.5">
          {(["all", "unread"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                filter === key ? "bg-violet-600 text-white" : "bg-surface-2 text-muted hover:text-ink"
              }`}
            >
              {key === "all" ? "All" : `Unread${unreadTotal > 0 ? ` (${unreadTotal})` : ""}`}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {isLoading ? (
          <ConversationListSkeleton count={6} />
        ) : conversations.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MessageCircle className="mx-auto h-9 w-9 text-faint" strokeWidth={1.5} />
            <p className="mt-4 text-[15px] font-medium text-ink">No chats yet</p>
            <p className="mt-1 text-[13.5px] text-muted">Message someone from their profile or a store to start chatting.</p>
          </div>
        ) : shown.length === 0 ? (
          <p className="px-6 py-12 text-center text-[13.5px] text-subtle">
            {filter === "unread" ? "No unread chats." : <>No chats match &ldquo;{search}&rdquo;.</>}
          </p>
        ) : (
          shown.map((conversation) => {
            const partner = conversation.otherParticipant;
            const last = conversation.lastMessage;
            const unread = (conversation.unreadCount ?? 0) > 0;
            const active = pathname === `/messages/${conversation.id}`;
            const isTyping = !!typing[conversation.id];
            const mine = !!last && last.senderId === currentUserId;

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                  active ? "bg-violet-50 dark:bg-violet-500/10" : "hover:bg-surface-sunken"
                }`}
              >
                <span className="relative shrink-0">
                  <UserAvatar name={partner?.name} src={partner?.avatar} size={50} />
                  {partner?.online && (
                    <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-surface bg-emerald-500" aria-label="Online" />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`flex min-w-0 items-center gap-1 truncate text-[14.5px] ${unread ? "font-bold text-ink" : "font-semibold text-ink"}`}>
                      <span className="truncate">{partner?.name ?? "Unknown user"}</span>
                      {partner?.store && <Store size={12} className="shrink-0 text-violet-500" aria-label="Seller" />}
                    </span>
                    <span className={`shrink-0 text-[11.5px] ${unread ? "font-semibold text-violet-600 dark:text-violet-400" : "text-subtle"}`}>
                      {shortTime(last?.createdAt ?? conversation.updatedAt)}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className={`flex min-w-0 flex-1 items-center gap-1 truncate text-[13px] ${unread ? "font-medium text-ink-2" : "text-subtle"}`}>
                      {isTyping ? (
                        <span className="font-medium text-violet-600 dark:text-violet-400">typing…</span>
                      ) : last ? (
                        <>
                          {mine && !last.deletedAt && (last.readAt ? <CheckCheck size={14} className="shrink-0 text-sky-500" /> : <Check size={14} className="shrink-0" />)}
                          <span className={`truncate ${last.deletedAt ? "pr-1 italic" : ""}`}>
                            {mine && !last.deletedAt ? "You: " : ""}
                            {messageSummary(last)}
                          </span>
                        </>
                      ) : (
                        "Say hello 👋"
                      )}
                    </span>
                    {unread && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[11px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
