"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowLeft, Loader2, Store } from "lucide-react";
import toast from "react-hot-toast";

import { useConversations } from "@/src/hooks/use-conversations";
import { useMessages } from "@/src/hooks/use-messages";
import { useSendMessage } from "@/src/hooks/use-send-message";
import { useMarkConversationRead } from "@/src/hooks/use-mark-conversation-read";
import { useDeleteMessage, useReactToMessage } from "@/src/hooks/use-message-actions";
import { useProduct } from "@/src/hooks/use-product";
import { useAuthStore } from "@/src/store/auth-store";
import { formatDayLabel, isSameDay } from "@/src/lib/date";
import { presenceLabel, toQuote } from "@/src/lib/chat";
import { getSocket } from "@/src/lib/socket";
import { MessageThreadSkeleton } from "@/src/components/skeletons/conversation-list-skeleton";
import { ChatPartner, ChatProduct, Message, MessageMedia, QuotedMessage } from "@/src/types/conversation";
import UserAvatar from "@/src/components/ui/user-avatar";
import ImageLightbox from "@/src/components/ui/image-lightbox";
import MessageBubble from "@/src/components/messages/message-bubble";
import Composer from "@/src/components/messages/composer";

// Messages from the same sender land in one visual group when they're
// within this long of each other.
const GROUP_GAP_MS = 5 * 60 * 1000;
const PAGE_SIZE = 50;
const TYPING_EMIT_INTERVAL = 2000;
const TYPING_EXPIRY = 3000;
const NEAR_BOTTOM_PX = 140;

type ThreadItem =
  | { kind: "day"; key: string; label: string }
  | { kind: "unread"; key: string }
  | { kind: "message"; message: Message; isGroupStart: boolean; isGroupEnd: boolean };

function buildThreadItems(messages: Message[], firstUnreadId: string | null): ThreadItem[] {
  const items: ThreadItem[] = [];
  const closeTo = (a: Message, b: Message) =>
    a.senderId === b.senderId &&
    isSameDay(a.createdAt, b.createdAt) &&
    Math.abs(new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) < GROUP_GAP_MS;

  messages.forEach((message, index) => {
    const prev = messages[index - 1];
    const next = messages[index + 1];
    if (!prev || !isSameDay(prev.createdAt, message.createdAt)) {
      items.push({ kind: "day", key: `day-${message.id}`, label: formatDayLabel(message.createdAt) });
    }
    if (message.id === firstUnreadId) items.push({ kind: "unread", key: "unread" });
    items.push({
      kind: "message",
      message,
      isGroupStart: !prev || !closeTo(prev, message) || message.id === firstUnreadId,
      isGroupEnd: !next || !closeTo(message, next) || next.id === firstUnreadId,
    });
  });
  return items;
}

export default function ConversationThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Keyed by conversation id so switching chats starts fresh (draft,
  // reply, typing state, scroll position).
  return <ConversationThread key={id} id={id} />;
}

function ConversationThread({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUserId = useAuthStore((state) => state.user?.id);

  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data: conversationsData } = useConversations({ limit: 50 });
  const conversation = conversationsData?.conversations.find((c) => c.id === id);
  const { data, isLoading, isFetching } = useMessages(id, { limit });
  const messages = useMemo(() => [...(data?.messages ?? [])].reverse(), [data]);
  const hasEarlier = !!data && data.total > messages.length;

  const partner: ChatPartner | undefined =
    conversation?.otherParticipant ?? messages.find((m) => m.senderId !== currentUserId)?.sender;

  const { mutate: sendMessage, isPending: sending } = useSendMessage(id);
  const { mutate: markRead } = useMarkConversationRead();
  const { mutate: react } = useReactToMessage(id);
  const { mutate: unsend } = useDeleteMessage(id);

  const [replyTo, setReplyTo] = useState<QuotedMessage | null>(null);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingExpiry = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingEmit = useRef(0);

  // "Ask about this product" (?product=<id>) attaches the product to the
  // first message; sellers can also pick one from the composer.
  const linkedProductId = searchParams.get("product");
  const { data: linkedProductData } = useProduct(linkedProductId ?? "", undefined, { enabled: !!linkedProductId });
  const [pickedProduct, setPickedProduct] = useState<ChatProduct | null>(null);
  const [linkedDismissed, setLinkedDismissed] = useState(false);
  const linkedProduct: ChatProduct | null =
    linkedProductId && linkedProductData && !linkedDismissed
      ? {
          id: linkedProductData.id,
          title: linkedProductData.title,
          price: linkedProductData.price,
          status: linkedProductData.status,
          images: [linkedProductData.images.find((i) => i.isPrimary) ?? linkedProductData.images[0]].filter(Boolean).map((i) => ({ url: i!.url })),
          store: { name: linkedProductData.store?.name ?? "", slug: linkedProductData.store?.slug ?? "" },
        }
      : null;
  const product = pickedProduct ?? linkedProduct;

  useEffect(() => {
    markRead(id);
  }, [id, markRead]);

  // Keep marking new incoming messages read while the chat is open.
  const hasUnreadIncoming = messages.some((m) => m.senderId !== currentUserId && !m.readAt && !m.pending);
  useEffect(() => {
    if (hasUnreadIncoming) markRead(id);
  }, [hasUnreadIncoming, id, markRead]);

  useEffect(() => {
    const socket = getSocket();
    const onTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== id) return;
      setOtherTyping(true);
      if (typingExpiry.current) clearTimeout(typingExpiry.current);
      typingExpiry.current = setTimeout(() => setOtherTyping(false), TYPING_EXPIRY);
    };
    socket.on("typing", onTyping);
    return () => {
      socket.off("typing", onTyping);
      if (typingExpiry.current) clearTimeout(typingExpiry.current);
    };
  }, [id]);

  const emitTyping = () => {
    const now = Date.now();
    if (now - lastTypingEmit.current > TYPING_EMIT_INTERVAL) {
      lastTypingEmit.current = now;
      getSocket().emit("typing", { conversationId: id });
    }
  };

  const send = (input: { content?: string; media?: MessageMedia[] }) => {
    sendMessage(
      { ...input, replyToId: replyTo?.id, productId: product?.id, quote: replyTo ?? undefined, productCard: product ?? undefined },
      {
        onSuccess: (sent) => {
          if (sent.contactHidden) {
            toast("Phone numbers, emails and social handles are hidden in chats with sellers. Keep chats and payments on Nestly so you're protected.", {
              icon: "🔒",
              duration: 6000,
            });
          }
        },
      }
    );
    setReplyTo(null);
    if (product) {
      setPickedProduct(null);
      setLinkedDismissed(true);
      if (linkedProductId) router.replace(`/messages/${id}`);
    }
  };

  const status = otherTyping ? "typing…" : presenceLabel(partner);
  const profileHref = partner ? `/users/${partner.username ?? partner.id}` : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-line bg-surface/90 px-2 py-2.5 backdrop-blur sm:px-4">
        <button
          type="button"
          onClick={() => router.push("/messages")}
          className="rounded-full p-2 text-muted transition-colors hover:bg-surface-sunken lg:hidden"
          aria-label="Back to chats"
        >
          <ArrowLeft size={19} />
        </button>

        {profileHref ? (
          <Link href={profileHref} className="group flex min-w-0 flex-1 items-center gap-3">
            <span className="relative shrink-0">
              <UserAvatar name={partner?.name} src={partner?.avatar} size={42} />
              {partner?.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-violet-700 dark:group-hover:text-violet-300">
                {partner?.name ?? "Conversation"}
              </span>
              <span
                className={`block h-4 truncate text-[12px] ${
                  otherTyping ? "font-medium text-violet-600 dark:text-violet-400" : partner?.online ? "text-emerald-600 dark:text-emerald-400" : "text-subtle"
                }`}
              >
                {status}
              </span>
            </span>
          </Link>
        ) : (
          <p className="flex-1 px-2 text-[15px] font-semibold text-ink">Conversation</p>
        )}

        {partner?.store && (
          <Link
            href={`/marketplace/seller/${partner.store.slug}`}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-[12.5px] font-semibold text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:border-violet-500/40 dark:hover:text-violet-300"
          >
            <Store size={14} /> <span className="hidden sm:inline">View store</span>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 overflow-hidden p-4">
          <MessageThreadSkeleton />
        </div>
      ) : (
        <ThreadMessages
          messages={messages}
          currentUserId={currentUserId}
          partnerName={partner?.name}
          partnerAvatar={partner?.avatar}
          otherTyping={otherTyping}
          hasEarlier={hasEarlier}
          loadingEarlier={isFetching && limit > messages.length}
          onLoadEarlier={() => setLimit((current) => current + PAGE_SIZE)}
          onReply={(message) => setReplyTo(toQuote(message))}
          onReact={(messageId, emoji) => react({ messageId, emoji })}
          onDelete={(messageId) => unsend(messageId)}
        />
      )}

      <Composer
        partnerName={partner?.name}
        currentUserId={currentUserId}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        product={product}
        onProductChange={(next) => {
          setPickedProduct(next);
          if (!next) setLinkedDismissed(true);
        }}
        onTyping={emitTyping}
        onSend={send}
        sending={sending}
      />
    </div>
  );
}

interface ThreadProps {
  messages: Message[];
  currentUserId?: string;
  partnerName?: string;
  partnerAvatar?: string | null;
  otherTyping: boolean;
  hasEarlier: boolean;
  loadingEarlier: boolean;
  onLoadEarlier: () => void;
  onReply: (message: Message) => void;
  onReact: (messageId: string, emoji: string | null) => void;
  onDelete: (messageId: string) => void;
}

// Mounted once the first page has loaded, so "New messages" can mark where
// the unread ones started when the chat was opened.
function ThreadMessages({
  messages,
  currentUserId,
  partnerName,
  partnerAvatar,
  otherTyping,
  hasEarlier,
  loadingEarlier,
  onLoadEarlier,
  onReply,
  onReact,
  onDelete,
}: ThreadProps) {
  const [firstUnreadId] = useState(() => messages.find((m) => m.senderId !== currentUserId && !m.readAt)?.id ?? null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [seenCount, setSeenCount] = useState(messages.length);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousHeight = useRef<number | null>(null);

  const items = useMemo(() => buildThreadItems(messages, firstUnreadId), [messages, firstUnreadId]);
  const lastMessage = messages[messages.length - 1];
  const unseen = atBottom ? 0 : messages.slice(seenCount).filter((m) => m.senderId !== currentUserId).length;

  const scrollToBottom = useCallback((smooth = false) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Opening the chat: start at "New messages" if there are any, else the end.
  useEffect(() => {
    const divider = document.getElementById("unread-divider");
    if (divider) divider.scrollIntoView({ block: "center" });
    else scrollToBottom();
  }, [scrollToBottom]);

  // New message: follow it if you're at the bottom (or you sent it).
  useEffect(() => {
    if (!lastMessage) return;
    if (atBottom || lastMessage.senderId === currentUserId) scrollToBottom(true);
    // Only when the newest message changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage?.id]);

  useEffect(() => {
    if (otherTyping && atBottom) scrollToBottom(true);
  }, [otherTyping, atBottom, scrollToBottom]);

  // Loading earlier messages: keep your place instead of jumping.
  const firstId = messages[0]?.id;
  useEffect(() => {
    const el = scrollRef.current;
    if (el && previousHeight.current !== null) {
      el.scrollTop += el.scrollHeight - previousHeight.current;
      previousHeight.current = null;
    }
  }, [firstId]);

  // Close the action menu on an outside click.
  useEffect(() => {
    if (!menuId) return;
    const close = (event: MouseEvent | TouchEvent) => {
      if (!(event.target as HTMLElement).closest("[data-chat-menu]")) setMenuId(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [menuId]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
    setAtBottom(near);
    if (near) setSeenCount(messages.length);
  };

  const jumpTo = (messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (!el) {
      toast("That message is further back - load earlier messages to see it.");
      return;
    }
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    setHighlightId(messageId);
    setTimeout(() => setHighlightId(null), 1800);
  };

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="h-full overflow-y-auto overscroll-contain bg-surface-sunken bg-[radial-gradient(rgba(124,58,237,0.07)_1px,transparent_1px)] px-3 py-4 [background-size:18px_18px] sm:px-6"
      >
        {hasEarlier && (
          <div className="flex justify-center pb-3">
            <button
              type="button"
              onClick={() => {
                previousHeight.current = scrollRef.current?.scrollHeight ?? null;
                onLoadEarlier();
              }}
              disabled={loadingEarlier}
              className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] font-semibold text-muted shadow-sm hover:text-ink disabled:opacity-60"
            >
              {loadingEarlier && <Loader2 size={12} className="animate-spin" />} Load earlier messages
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="text-[40px]">👋</span>
            <p className="mt-2 text-[14px] font-medium text-ink">Say hello to {partnerName ?? "them"}</p>
            <p className="mt-1 max-w-xs text-[12.5px] text-muted">Ask about sizes, delivery or anything else - and pay safely through Nestly checkout.</p>
          </div>
        ) : (
          items.map((item) => {
            if (item.kind === "day") {
              return (
                <div key={item.key} className="sticky top-0 z-[5] flex justify-center py-2">
                  <span className="rounded-full bg-surface/95 px-3 py-1 text-[11px] font-semibold text-muted shadow-sm backdrop-blur">{item.label}</span>
                </div>
              );
            }
            if (item.kind === "unread") {
              return (
                <div key={item.key} id="unread-divider" className="my-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-violet-300/60 dark:bg-violet-500/40" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400">New messages</span>
                  <span className="h-px flex-1 bg-violet-300/60 dark:bg-violet-500/40" />
                </div>
              );
            }
            const { message } = item;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                mine={message.senderId === currentUserId}
                currentUserId={currentUserId}
                partnerName={partnerName}
                isGroupStart={item.isGroupStart}
                isGroupEnd={item.isGroupEnd}
                highlighted={highlightId === message.id}
                menuOpen={menuId === message.id}
                onMenu={(open) => setMenuId(open ? message.id : null)}
                onReply={() => onReply(message)}
                onReact={(emoji) => onReact(message.id, emoji)}
                onDelete={() => onDelete(message.id)}
                onJumpTo={jumpTo}
                onOpenImage={setLightbox}
              />
            );
          })
        )}

        {otherTyping && (
          <div className="flex items-end gap-2 pt-2">
            <UserAvatar name={partnerName} src={partnerAvatar} size={26} />
            <div className="flex items-center gap-1 rounded-[20px] rounded-bl-[6px] border border-line bg-surface px-4 py-3">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: `${dot * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {!atBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-[0_10px_24px_-10px_rgba(15,15,20,0.4)] transition-transform hover:scale-105"
          aria-label="Jump to latest"
        >
          <ArrowDown size={18} />
          {unseen > 0 && (
            <span className="absolute -top-1.5 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10.5px] font-bold text-white">
              {unseen}
            </span>
          )}
        </button>
      )}

      <ImageLightbox src={lightbox ?? ""} alt="Photo" open={!!lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
