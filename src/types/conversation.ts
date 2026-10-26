import { PublicUser } from "./user";
import { MediaType } from "./upload";

export interface MessageMedia {
  url: string;
  type: MediaType;
}

/** A product shared in a chat, shown as a card. */
export interface ChatProduct {
  id: string;
  title: string;
  price: number;
  status: string;
  images: { url: string }[];
  store: { name: string; slug: string };
}

/** The message a reply is quoting. */
export interface QuotedMessage {
  id: string;
  content: string | null;
  senderId: string;
  deletedAt: string | null;
  sender?: { name: string };
  media?: MessageMedia[];
  product?: { title: string } | null;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  // A message can be media-only (a picture/video with no caption) or a
  // product card - text, media and product can each be empty, never all.
  content: string | null;
  media?: MessageMedia[];
  replyTo?: QuotedMessage | null;
  product?: ChatProduct | null;
  reactions?: MessageReaction[];
  readAt?: string | null;
  // Unsent by the sender - shows "This message was deleted".
  deletedAt?: string | null;
  createdAt: string;
  sender?: PublicUser;
  // Only on a send response: contact details in it were hidden (chats with
  // a seller - see components/messages/message-text).
  contactHidden?: boolean;
  // Client-only: set on the optimistic copy of a message while it's still
  // in flight to the server. Never present on anything the API returns.
  pending?: boolean;
}

/** The other person in a chat, with what the header and list show. */
export interface ChatPartner extends PublicUser {
  online?: boolean;
  lastSeenAt?: string | null;
  /** Their store, if they sell. */
  store?: { name: string; slug: string } | null;
}

export interface Conversation {
  id: string;
  otherParticipant?: ChatPartner;
  lastMessage?: (Message & { product?: { title: string } | null }) | null;
  unreadCount?: number;
  updatedAt: string;
}

export interface SendMessageInput {
  content?: string;
  media?: MessageMedia[];
  replyToId?: string;
  productId?: string;
}

export interface ConversationListParams {
  page?: number;
  limit?: number;
}

export interface MessageListParams {
  page?: number;
  limit?: number;
}
