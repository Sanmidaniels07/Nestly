"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
    // "Load earlier messages" asks for a bigger page - keep showing the
    // current one meanwhile instead of a loading state.
    placeholderData: keepPreviousData,
  });
};
