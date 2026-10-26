"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteMessage, reactToMessage } from "../services/conversation.services";
import { replaceCachedMessage, updateCachedMessage } from "../lib/chat-cache";
import { useAuthStore } from "../store/auth-store";

// React to a message - shows instantly, then the server's copy replaces it.
export const useReactToMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string | null }) =>
      reactToMessage(conversationId, messageId, emoji),
    onMutate: ({ messageId, emoji }) => {
      if (!userId) return;
      updateCachedMessage(queryClient, conversationId, messageId, (message) => {
        const others = (message.reactions ?? []).filter((r) => r.userId !== userId);
        return { ...message, reactions: emoji ? [...others, { emoji, userId }] : others };
      });
    },
    onSuccess: (response) => replaceCachedMessage(queryClient, response.data),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      toast.error("Couldn't react - try again");
    },
  });
};

// Unsend for everyone.
export const useDeleteMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(conversationId, messageId),
    onMutate: (messageId) => {
      updateCachedMessage(queryClient, conversationId, messageId, (message) => ({
        ...message,
        content: null,
        media: [],
        product: null,
        reactions: [],
        deletedAt: new Date().toISOString(),
      }));
    },
    onSuccess: (response) => {
      replaceCachedMessage(queryClient, response.data);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      toast.error("Couldn't delete the message - try again");
    },
  });
};
