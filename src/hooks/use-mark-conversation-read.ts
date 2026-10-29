"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markConversationRead } from "../services/conversation.services";

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markConversationRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // The chat's "New Message" notifications were marked read with it.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
