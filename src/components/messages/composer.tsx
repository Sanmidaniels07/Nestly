"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Plus, Search, Send, ShoppingBag, Smile, X } from "lucide-react";

import { ChatProduct, MessageMedia, QuotedMessage } from "@/src/types/conversation";
import { EMOJI_GROUPS, messageSummary } from "@/src/lib/chat";
import { useUploadFiles } from "@/src/hooks/use-upload-files";
import { useMyStore } from "@/src/hooks/use-my-store";
import { useMyProducts } from "@/src/hooks/use-my-products";
import ChatProductCard from "./chat-product-card";

const TEXTAREA_MAX_HEIGHT = 140;

interface Props {
  partnerName?: string;
  currentUserId?: string;
  replyTo: QuotedMessage | null;
  onCancelReply: () => void;
  product: ChatProduct | null;
  onProductChange: (product: ChatProduct | null) => void;
  onTyping: () => void;
  onSend: (input: { content?: string; media?: MessageMedia[] }) => void;
  sending: boolean;
}

// Message box: emoji, photos/videos (pick, paste or drop), products for
// sellers, reply preview, Enter to send / Shift+Enter for a new line.
export default function Composer({
  partnerName,
  currentUserId,
  replyTo,
  onCancelReply,
  product,
  onProductChange,
  onTyping,
  onSend,
  sending,
}: Props) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MessageMedia[]>([]);
  const [panel, setPanel] = useState<"emoji" | "attach" | "products" | null>(null);
  const [dragging, setDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { mutate: uploadFiles, isPending: uploading } = useUploadFiles();

  const canSend = (content.trim().length > 0 || media.length > 0 || !!product) && !uploading && !sending;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [content]);

  // Replying: jump into the box.
  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  // Close the emoji/attach panels on an outside click.
  useEffect(() => {
    if (!panel) return;
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setPanel(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [panel]);

  const upload = (files: File[]) => {
    const usable = files.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (usable.length === 0) return;
    uploadFiles(usable, { onSuccess: (response) => setMedia((prev) => [...prev, ...response.data].slice(0, 10)) });
  };

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    const next = content.slice(0, start) + emoji + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const send = () => {
    if (!canSend) return;
    onSend({ content: content.trim() || undefined, media: media.length > 0 ? media : undefined });
    setContent("");
    setMedia([]);
    setPanel(null);
  };

  return (
    <div
      ref={rootRef}
      className={`relative border-t border-line bg-surface/80 px-3 pb-3 pt-2.5 backdrop-blur sm:px-4 ${dragging ? "ring-2 ring-inset ring-violet-400" : ""}`}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        upload(Array.from(e.dataTransfer.files));
      }}
    >
      {replyTo && (
        <div className="mb-2 flex items-center gap-2.5 rounded-xl border-l-[3px] border-violet-500 bg-violet-50 px-3 py-2 dark:bg-violet-500/10">
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-violet-700 dark:text-violet-300">
              Replying to {replyTo.senderId === currentUserId ? "yourself" : replyTo.sender?.name ?? partnerName ?? "them"}
            </p>
            <p className="truncate text-[12.5px] text-muted">{messageSummary(replyTo)}</p>
          </div>
          <button type="button" onClick={onCancelReply} aria-label="Cancel reply" className="rounded-full p-1 text-subtle hover:bg-surface hover:text-ink">
            <X size={15} />
          </button>
        </div>
      )}

      {product && (
        <div className="mb-2">
          <ChatProductCard product={product} onRemove={() => onProductChange(null)} />
        </div>
      )}

      {(media.length > 0 || uploading) && (
        <div className="mb-2 flex flex-wrap gap-2">
          {media.map((item) => (
            <div key={item.url} className="group relative h-16 w-16 overflow-hidden rounded-xl bg-surface-2">
              {item.type === "VIDEO" ? (
                <video src={item.url} className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="Attachment" className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => setMedia((prev) => prev.filter((m) => m.url !== item.url))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                aria-label="Remove attachment"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          {uploading && (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-2">
              <Loader2 size={16} className="animate-spin text-violet-600 dark:text-violet-400" />
            </div>
          )}
        </div>
      )}

      {panel === "emoji" && <EmojiPanel onPick={insertEmoji} />}
      {panel === "attach" && (
        <AttachPanel
          onPhotos={() => {
            setPanel(null);
            fileInputRef.current?.click();
          }}
          onProducts={() => setPanel("products")}
        />
      )}
      {panel === "products" && (
        <ProductPanel
          onPick={(picked) => {
            onProductChange(picked);
            setPanel(null);
          }}
        />
      )}

      <div className="flex items-end gap-1.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => {
            upload(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <ToolButton label="Attach" active={panel === "attach" || panel === "products"} onClick={() => setPanel(panel === "attach" ? null : "attach")}>
          <Plus size={20} className={`transition-transform ${panel === "attach" || panel === "products" ? "rotate-45" : ""}`} />
        </ToolButton>

        <div className="flex min-w-0 flex-1 items-end rounded-[22px] border border-line bg-surface-2 pl-4 pr-1 transition-colors focus-within:border-violet-400 focus-within:bg-surface">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
              if (e.key === "Escape" && replyTo) onCancelReply();
            }}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files);
              if (files.length > 0) {
                e.preventDefault();
                upload(files);
              }
            }}
            placeholder="Message"
            rows={1}
            className="max-h-36 min-w-0 flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-subtle sm:text-[14px]"
          />
          <ToolButton label="Emoji" active={panel === "emoji"} onClick={() => setPanel(panel === "emoji" ? null : "emoji")}>
            <Smile size={19} />
          </ToolButton>
        </div>

        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_8px_20px_-10px_rgba(91,33,182,0.8)] transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          aria-label="Send message"
        >
          {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} className="-ml-0.5" />}
        </button>
      </div>
    </div>
  );
}

function ToolButton({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={active}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
        active ? "text-violet-600 dark:text-violet-400" : "text-subtle hover:text-violet-600 dark:hover:text-violet-400"
      }`}
    >
      {children}
    </button>
  );
}

const panelClass =
  "absolute bottom-full left-3 right-3 z-20 mb-2 rounded-2xl border border-line bg-surface shadow-[0_18px_40px_-16px_rgba(15,15,20,0.35)] sm:left-4 sm:right-auto sm:w-[340px]";

function EmojiPanel({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <div className={`${panelClass} max-h-72 overflow-y-auto p-3`}>
      {EMOJI_GROUPS.map((group) => (
        <div key={group.label} className="mb-2 last:mb-0">
          <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">{group.label}</p>
          <div className="grid grid-cols-8 gap-0.5">
            {group.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onPick(emoji)}
                className="flex h-9 items-center justify-center rounded-lg text-[21px] transition-colors hover:bg-surface-sunken"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AttachPanel({ onPhotos, onProducts }: { onPhotos: () => void; onProducts: () => void }) {
  // Sellers can share their products; useMyStore 404s for everyone else.
  const { data: store } = useMyStore(true);

  return (
    <div className={`${panelClass} p-1.5 sm:w-60`}>
      <PanelItem icon={<ImageIcon size={17} />} tone="bg-pink-50 text-pink-600 dark:bg-pink-500/10" label="Photos & videos" onClick={onPhotos} />
      {store && <PanelItem icon={<ShoppingBag size={17} />} tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10" label="Share a product" onClick={onProducts} />}
    </div>
  );
}

function PanelItem({ icon, tone, label, onClick }: { icon: React.ReactNode; tone: string; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-[13.5px] font-medium text-ink-2 hover:bg-surface-sunken">
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}>{icon}</span>
      {label}
    </button>
  );
}

function ProductPanel({ onPick }: { onPick: (product: ChatProduct) => void }) {
  const [search, setSearch] = useState("");
  const { data: store } = useMyStore(true);
  const { data, isLoading } = useMyProducts({ limit: 30, status: "PUBLISHED" }, { enabled: !!store });
  const query = search.trim().toLowerCase();
  const products = (data?.products ?? []).filter((p) => !query || p.title.toLowerCase().includes(query));

  return (
    <div className={`${panelClass} p-2 sm:w-[360px]`}>
      <div className="relative mb-2">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your products"
          className="h-10 w-full rounded-xl border border-line bg-surface-2 pl-9 pr-3 text-[16px] text-ink outline-none focus:border-violet-400 sm:text-[13.5px]"
        />
      </div>
      <div className="max-h-64 space-y-1 overflow-y-auto">
        {isLoading && <p className="py-6 text-center text-[13px] text-subtle">Loading…</p>}
        {!isLoading && products.length === 0 && <p className="py-6 text-center text-[13px] text-subtle">No published products found.</p>}
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() =>
              onPick({
                id: p.id,
                title: p.title,
                price: p.price,
                status: p.status,
                images: [p.images.find((i) => i.isPrimary) ?? p.images[0]].filter(Boolean).map((i) => ({ url: i!.url })),
                store: { name: store?.name ?? "", slug: store?.slug ?? "" },
              })
            }
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-sunken"
          >
            <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
              {p.images[0]?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(p.images.find((i) => i.isPrimary) ?? p.images[0]).url} alt="" className="h-full w-full object-cover" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-medium text-ink">{p.title}</span>
              <span className="block text-[12px] text-violet-700 dark:text-violet-300">₦{p.price.toLocaleString()}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
