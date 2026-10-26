"use client";

import { useRef } from "react";
import { Ban, Check, CheckCheck, Clock, Copy, CornerUpLeft, MoreHorizontal, SmilePlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Message } from "@/src/types/conversation";
import { formatTimeOfDay } from "@/src/lib/date";
import { QUICK_REACTIONS, messageSummary } from "@/src/lib/chat";
import MessageText from "./message-text";
import ChatProductCard from "./chat-product-card";

interface Props {
  message: Message;
  mine: boolean;
  currentUserId?: string;
  partnerName?: string;
  isGroupStart: boolean;
  isGroupEnd: boolean;
  highlighted: boolean;
  menuOpen: boolean;
  onMenu: (open: boolean) => void;
  onReply: () => void;
  onReact: (emoji: string | null) => void;
  onDelete: () => void;
  onJumpTo: (messageId: string) => void;
  onOpenImage: (url: string) => void;
}

const LONG_PRESS_MS = 450;

// One message: quote (if it's a reply), photos, product card, text, time
// and ticks inside the bubble, reactions under it. Actions (react, reply,
// copy, unsend) on hover on desktop, long-press on phones.
export default function MessageBubble({
  message,
  mine,
  currentUserId,
  partnerName,
  isGroupStart,
  isGroupEnd,
  highlighted,
  menuOpen,
  onMenu,
  onReply,
  onReact,
  onDelete,
  onJumpTo,
  onOpenImage,
}: Props) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deleted = !!message.deletedAt;
  const media = message.media ?? [];
  const reactions = message.reactions ?? [];
  const myReaction = reactions.find((r) => r.userId === currentUserId)?.emoji ?? null;
  const canAct = !deleted && !message.pending;

  // Corners: a small "tail" corner on the last bubble of a group.
  const shape = mine
    ? `rounded-[20px] ${isGroupEnd ? "rounded-br-[6px]" : ""} ${!isGroupStart ? "rounded-tr-[8px]" : ""}`
    : `rounded-[20px] ${isGroupEnd ? "rounded-bl-[6px]" : ""} ${!isGroupStart ? "rounded-tl-[8px]" : ""}`;
  const tone = deleted
    ? "border border-dashed border-line bg-transparent text-subtle"
    : mine
      ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_6px_18px_-10px_rgba(91,33,182,0.7)]"
      : "border border-line bg-surface text-ink shadow-[0_4px_14px_-10px_rgba(15,15,20,0.25)]";

  const time = (
    <span className={`ml-auto inline-flex shrink-0 translate-y-[3px] items-center gap-1 pl-2 text-[10.5px] ${mine && !deleted ? "text-white/75" : "text-subtle"}`}>
      {formatTimeOfDay(message.createdAt)}
      {mine && !deleted &&
        (message.pending ? (
          <Clock size={11} />
        ) : message.readAt ? (
          <CheckCheck size={13} className="text-sky-200" aria-label="Read" />
        ) : (
          <Check size={13} aria-label="Sent" />
        ))}
    </span>
  );

  const startPress = () => {
    if (!canAct) return;
    pressTimer.current = setTimeout(() => onMenu(true), LONG_PRESS_MS);
  };
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const copy = async () => {
    onMenu(false);
    try {
      await navigator.clipboard.writeText(message.content ?? "");
      toast.success("Copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  // Group reactions: 👍 2, ❤️ 1.
  const counts = reactions.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.emoji]: (acc[r.emoji] ?? 0) + 1 }), {});

  return (
    <div
      id={`msg-${message.id}`}
      className={`group/msg relative flex scroll-mt-24 ${mine ? "justify-end" : "justify-start"} ${isGroupStart ? "pt-2" : "pt-0.5"}`}
    >
      <div className={`relative flex max-w-[82%] items-center gap-1.5 sm:max-w-[70%] ${mine ? "flex-row-reverse" : ""}`}>
        <div
          className={`relative min-w-0 transition-[transform,opacity] ${message.pending ? "opacity-70" : ""} ${highlighted ? "animate-[pulse_1s_ease-in-out_2]" : ""}`}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          onTouchMove={endPress}
          onContextMenu={(e) => {
            if (!canAct) return;
            e.preventDefault();
            onMenu(true);
          }}
          onDoubleClick={() => canAct && onReact(myReaction === "❤️" ? null : "❤️")}
        >
          <div className={`overflow-hidden ${shape} ${tone} ${highlighted ? "ring-2 ring-amber-400" : ""}`}>
            {deleted ? (
              <p className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] italic">
                <Ban size={13} /> This message was deleted {time}
              </p>
            ) : (
              <>
                {message.replyTo && (
                  <button
                    type="button"
                    onClick={() => onJumpTo(message.replyTo!.id)}
                    className={`m-1.5 mb-0 block w-[calc(100%-0.75rem)] rounded-xl border-l-[3px] px-3 py-1.5 text-left ${
                      mine ? "border-white/70 bg-white/15" : "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
                    }`}
                  >
                    <span className={`block text-[11.5px] font-semibold ${mine ? "text-white" : "text-violet-700 dark:text-violet-300"}`}>
                      {message.replyTo.senderId === currentUserId ? "You" : message.replyTo.sender?.name ?? partnerName ?? "Them"}
                    </span>
                    <span className={`line-clamp-2 text-[12.5px] ${mine ? "text-white/85" : "text-muted"}`}>{messageSummary(message.replyTo)}</span>
                  </button>
                )}

                {media.length > 0 && <MediaGrid media={media} onOpenImage={onOpenImage} />}

                {message.product && (
                  <div className="p-1.5 pb-0">
                    <ChatProductCard product={message.product} mine={mine} />
                  </div>
                )}

                {message.content ? (
                  <div className="flex flex-wrap items-end px-3.5 py-2">
                    <p className="min-w-0 whitespace-pre-wrap text-[14px] leading-relaxed [overflow-wrap:anywhere]">
                      <MessageText text={message.content} />
                    </p>
                    {time}
                  </div>
                ) : (
                  <div className="flex justify-end px-3 pb-1.5 pt-1">{time}</div>
                )}
              </>
            )}
          </div>

          {Object.keys(counts).length > 0 && (
            <div className={`-mt-1.5 flex ${mine ? "justify-end pr-2" : "justify-start pl-2"}`}>
              <div className="relative z-[1] flex items-center gap-0.5 rounded-full border border-line bg-surface px-1.5 py-0.5 shadow-sm">
                {Object.entries(counts).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onReact(myReaction === emoji ? null : emoji)}
                    className={`flex items-center rounded-full px-1 text-[13px] leading-5 ${myReaction === emoji ? "bg-violet-100 dark:bg-violet-500/20" : ""}`}
                    aria-label={`${emoji} ${count}`}
                  >
                    {emoji}
                    {count > 1 && <span className="ml-0.5 text-[10.5px] font-semibold text-muted">{count}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {menuOpen && (
            <ActionMenu
              mine={mine}
              hasText={!!message.content}
              myReaction={myReaction}
              onReact={(emoji) => {
                onMenu(false);
                onReact(emoji === myReaction ? null : emoji);
              }}
              onReply={() => {
                onMenu(false);
                onReply();
              }}
              onCopy={copy}
              onDelete={() => {
                onMenu(false);
                onDelete();
              }}
            />
          )}
        </div>

        {/* Desktop hover actions. */}
        {canAct && !menuOpen && (
          <div className="hidden shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/msg:opacity-100 sm:flex">
            <HoverButton label="React" onClick={() => onMenu(true)}>
              <SmilePlus size={15} />
            </HoverButton>
            <HoverButton label="Reply" onClick={onReply}>
              <CornerUpLeft size={15} />
            </HoverButton>
            <HoverButton label="More" onClick={() => onMenu(true)}>
              <MoreHorizontal size={15} />
            </HoverButton>
          </div>
        )}
      </div>
    </div>
  );
}

function HoverButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-full text-subtle transition-colors hover:bg-surface hover:text-violet-600 dark:hover:text-violet-400"
    >
      {children}
    </button>
  );
}

function ActionMenu({
  mine,
  hasText,
  myReaction,
  onReact,
  onReply,
  onCopy,
  onDelete,
}: {
  mine: boolean;
  hasText: boolean;
  myReaction: string | null;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      data-chat-menu
      className={`absolute bottom-full z-20 mb-2 w-max min-w-[220px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_-16px_rgba(15,15,20,0.35)] ${
        mine ? "right-0" : "left-0"
      }`}
    >
      <div className="flex items-center gap-0.5 border-b border-line-soft px-2 py-1.5">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onReact(emoji)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-[20px] transition-transform hover:scale-125 ${
              myReaction === emoji ? "bg-violet-100 dark:bg-violet-500/20" : ""
            }`}
            aria-label={`React ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="py-1 text-[13.5px]">
        <MenuItem icon={<CornerUpLeft size={15} />} label="Reply" onClick={onReply} />
        {hasText && <MenuItem icon={<Copy size={15} />} label="Copy text" onClick={onCopy} />}
        {mine && <MenuItem icon={<Trash2 size={15} />} label="Delete for everyone" onClick={onDelete} danger />}
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-surface-sunken ${
        danger ? "text-red-600 dark:text-red-400" : "text-ink-2"
      }`}
    >
      {icon} {label}
    </button>
  );
}

// 1 photo full width; 2 side by side; 3 = one big + two; 4+ = 2x2 with "+N".
function MediaGrid({ media, onOpenImage }: { media: NonNullable<Message["media"]>; onOpenImage: (url: string) => void }) {
  const shown = media.slice(0, 4);
  const extra = media.length - shown.length;
  const grid = shown.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className={`grid gap-0.5 ${grid}`}>
      {shown.map((item, index) => {
        const span = shown.length === 3 && index === 0 ? "col-span-2" : "";
        const height = shown.length === 1 ? "max-h-80" : "h-36";
        return (
          <div key={`${item.url}-${index}`} className={`relative overflow-hidden bg-black/5 ${span}`}>
            {item.type === "VIDEO" ? (
              <video src={item.url} controls className={`w-full bg-black object-cover ${height}`} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt="Photo"
                onClick={() => onOpenImage(item.url)}
                className={`w-full cursor-zoom-in object-cover ${height}`}
              />
            )}
            {extra > 0 && index === shown.length - 1 && (
              <button
                type="button"
                onClick={() => onOpenImage(item.url)}
                className="absolute inset-0 flex items-center justify-center bg-black/55 text-[22px] font-semibold text-white"
              >
                +{extra}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
