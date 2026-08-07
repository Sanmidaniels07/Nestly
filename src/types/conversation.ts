import { PublicUser } from "./user";
import { MediaType } from "./upload";

export interface MessageMedia {
  url: string;
  type: MediaType;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  // A message can be media-only (a picture/video with no caption) - either
  // this or `media` can be empty, but never both.
  content: string | null;
  media?: MessageMedia[];
  readAt?: string | null;
  createdAt: string;
  sender?: PublicUser;
  // Client-only: set on the optimistic copy of a message while it's still
  // in flight to the server. Never present on anything the API returns.
  pending?: boolean;
}

export interface Conversation {
  id: string;
  otherParticipant?: PublicUser;
  lastMessage?: Message | null;
  unreadCount?: number;
  updatedAt: string;
}

export interface ConversationListParams {
  page?: number;
  limit?: number;
}

export interface MessageListParams {
  page?: number;
  limit?: number;
}
