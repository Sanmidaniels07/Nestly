"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createConversation } from "../services/conversation.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { Conversation } from "../types/conversation";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Conversation>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: createConversation,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to start conversation");
    },
  });
};
