"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { sendMessage } from "../services/conversation.services";
import { ApiErrorResponse, ApiResponse, Paginated } from "../types/api";
import { Message, MessageMedia } from "../types/conversation";
import { useAuthStore } from "../store/auth-store";

interface SendMessageInput {
  content?: string;
  media?: MessageMedia[];
}

type MessagesResponse = ApiResponse<Paginated<"messages", Message>>;

// Matches every cached page of this conversation's messages regardless of
// the `params` (page/limit) it was fetched with.
const messagesQueryPredicate = (conversationId: string) => (query: { queryKey: readonly unknown[] }) =>
  query.queryKey[0] === "messages" && query.queryKey[1] === conversationId;

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation<
    Message,
    AxiosError<ApiErrorResponse>,
    SendMessageInput,
    { tempId: string; snapshot: [readonly unknown[], MessagesResponse | undefined][] }
  >({
    mutationFn: async (payload) => {
      const response = await sendMessage(conversationId, payload);
      return response.data;
    },

    // Drop the message into the thread immediately - with a `pending` flag
    // the UI renders as a faded bubble - so sending feels instant instead of
    // waiting on a round trip, then swap it for the real thing in onSuccess.
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ predicate: messagesQueryPredicate(conversationId) });

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        conversationId,
        senderId: currentUser?.id ?? "",
        content: payload.content ?? null,
        media: payload.media,
        readAt: null,
        createdAt: new Date().toISOString(),
        pending: true,
      };

      const snapshot = queryClient.getQueriesData<MessagesResponse>({
        predicate: messagesQueryPredicate(conversationId),
      });

      queryClient.setQueriesData<MessagesResponse>(
        { predicate: messagesQueryPredicate(conversationId) },
        (old) => {
          if (!old) return old;
          // Messages are stored newest-first, matching the API's order.
          return {
            ...old,
            data: { ...old.data, messages: [optimisticMessage, ...old.data.messages] },
          };
        }
      );

      return { tempId, snapshot };
    },

    onSuccess: (message, _payload, context) => {
      queryClient.setQueriesData<MessagesResponse>(
        { predicate: messagesQueryPredicate(conversationId) },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              messages: old.data.messages.map((m) =>
                m.id === context?.tempId ? message : m
              ),
            },
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (error, _payload, context) => {
      context?.snapshot.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(error.response?.data.message ?? "Failed to send message");
    },
  });
};
