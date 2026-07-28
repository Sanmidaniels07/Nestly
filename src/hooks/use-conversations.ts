"use client";

import { useQuery } from "@tanstack/react-query";

import { getConversations } from "../services/conversation.services";
import { ConversationListParams } from "../types/conversation";

export const useConversations = (params: ConversationListParams = {}) => {
  return useQuery({
    queryKey: ["conversations", params],
    queryFn: () => getConversations(params),
    select: (response) => response.data,
  });
};
