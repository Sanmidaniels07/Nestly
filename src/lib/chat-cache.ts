import { QueryClient } from "@tanstack/react-query";

import { ApiResponse, Paginated } from "../types/api";
import { Conversation, Message } from "../types/conversation";

// Small helpers for keeping cached chats in step with live events and
// optimistic actions, without refetching whole threads.

type MessagesResponse = ApiResponse<Paginated<"messages", Message>>;
type ConversationsResponse = ApiResponse<Paginated<"conversations", Conversation>>;

const messagesOf = (conversationId: string) => (query: { queryKey: readonly unknown[] }) =>
  query.queryKey[0] === "messages" && query.queryKey[1] === conversationId;

/** Apply a change to one message in every cached page of its thread. */
export const updateCachedMessage = (
  queryClient: QueryClient,
  conversationId: string,
  messageId: string,
  update: (message: Message) => Message
) => {
  queryClient.setQueriesData<MessagesResponse>({ predicate: messagesOf(conversationId) }, (old) =>
    old
      ? { ...old, data: { ...old.data, messages: old.data.messages.map((m) => (m.id === messageId ? update(m) : m)) } }
      : old
  );
};

/** Swap in the server's copy of a message (reaction or unsend from anyone). */
export const replaceCachedMessage = (queryClient: QueryClient, message: Message) =>
  updateCachedMessage(queryClient, message.conversationId, message.id, () => message);

/** Someone you chat with came online or left. */
export const updateCachedPresence = (
  queryClient: QueryClient,
  presence: { userId: string; online: boolean; lastSeenAt: string | null }
) => {
  queryClient.setQueriesData<ConversationsResponse>({ queryKey: ["conversations"] }, (old) =>
    old
      ? {
          ...old,
          data: {
            ...old.data,
            conversations: old.data.conversations.map((c) =>
              c.otherParticipant?.id === presence.userId
                ? {
                    ...c,
                    otherParticipant: {
                      ...c.otherParticipant,
                      online: presence.online,
                      lastSeenAt: presence.lastSeenAt ?? c.otherParticipant.lastSeenAt,
                    },
                  }
                : c
            ),
          },
        }
      : old
  );
};
