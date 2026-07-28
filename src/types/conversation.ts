import { PublicUser } from "./user";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt?: string | null;
  createdAt: string;
  sender?: PublicUser;
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
