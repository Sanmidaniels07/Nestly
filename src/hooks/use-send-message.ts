"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { sendMessage } from "../services/conversation.services";
import { ApiErrorResponse } from "../types/api";

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (content) => sendMessage(conversationId, content),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to send message");
    },
  });
};
