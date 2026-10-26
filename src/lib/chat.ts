import { ChatPartner, Message, QuotedMessage } from "../types/conversation";

// Small chat helpers shared by the conversation list and the thread.

/** "Online", "Active 5m ago", "Active yesterday" - or "" when unknown. */
export const presenceLabel = (partner?: ChatPartner | null) => {
  if (!partner) return "";
  if (partner.online) return "Online";
  if (!partner.lastSeenAt) return "";
  const minutes = Math.floor((Date.now() - new Date(partner.lastSeenAt).getTime()) / 60000);
  if (minutes < 1) return "Active just now";
  if (minutes < 60) return `Active ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Active ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Active yesterday";
  if (days < 7) return `Active ${days}d ago`;
  return "";
};

/** List timestamps: "10:32 AM" today, "Yesterday", "Mon" this week, else "12 Oct". */
export const shortTime = (date: string) => {
  const then = new Date(date);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = 24 * 60 * 60 * 1000;
  if (then.getTime() >= startOfToday) return then.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (then.getTime() >= startOfToday - day) return "Yesterday";
  if (then.getTime() >= startOfToday - 6 * day) return then.toLocaleDateString("en-US", { weekday: "short" });
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

/** One-line summary of a message, for previews and reply quotes. */
export const messageSummary = (message: Pick<Message, "content" | "media" | "deletedAt"> & { product?: { title: string } | null }) => {
  if (message.deletedAt) return "Message deleted";
  if (message.content) return message.content;
  if (message.product) return `🛍️ ${message.product.title}`;
  const first = message.media?.[0];
  if (first) return first.type === "VIDEO" ? "🎥 Video" : "📷 Photo";
  return "";
};

/** What a reply bubble quotes, built from the message being replied to. */
export const toQuote = (message: Message): QuotedMessage => ({
  id: message.id,
  content: message.content,
  senderId: message.senderId,
  deletedAt: message.deletedAt ?? null,
  sender: message.sender ? { name: message.sender.name } : undefined,
  media: message.media?.slice(0, 1),
  product: message.product ? { title: message.product.title } : null,
});

export const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

// Quick reactions, and the composer's emoji picker.
export const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  { label: "Smileys", emojis: ["😀", "😁", "😂", "🤣", "😊", "😍", "🥰", "😘", "😎", "🤩", "🥳", "😇", "🙂", "😉", "😅", "😆", "🤔", "🤗", "😴", "😮", "😢", "😭", "😤", "😡", "🙄", "😬", "🤭"] },
  { label: "Gestures", emojis: ["👍", "👎", "👏", "🙌", "🙏", "👌", "✌️", "🤞", "👋", "💪", "🤝", "👀"] },
  { label: "Hearts", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💕", "💖", "💯", "✨"] },
  { label: "Shopping & celebrations", emojis: ["🛍️", "🎁", "🎂", "🍰", "🧁", "🎉", "🎈", "🔥", "⭐", "📦", "🚚", "💰", "💸", "✅", "❌", "⏰"] },
];
