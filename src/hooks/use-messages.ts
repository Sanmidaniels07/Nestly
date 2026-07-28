"use client";

import { useQuery } from "@tanstack/react-query";

import { getMessages } from "../services/conversation.services";
import { MessageListParams } from "../types/conversation";

export const useMessages = (
  conversationId: string,
  params: MessageListParams = {}
) => {
  return useQuery({
    queryKey: ["messages", conversationId, params],
    queryFn: () => getMessages(conversationId, params),
    select: (response) => response.data,
    enabled: !!conversationId,
  });
};
