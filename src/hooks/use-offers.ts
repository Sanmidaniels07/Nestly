"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createOffer, respondOffer, withdrawOffer } from "../services/offer.services";
import { ApiErrorResponse } from "../types/api";
import { CreateOfferPayload, RespondOfferPayload } from "../types/conversation";

const errorText = (error: AxiosError<ApiErrorResponse>, fallback: string) => error.response?.data.message ?? fallback;

// Every offer action ends with the chat refetched - the cards for both
// sides also update live over the socket (message:new / message:updated).
const useRefreshChat = () => {
  const queryClient = useQueryClient();
  return (conversationId: string) => {
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };
};

export const useCreateOffer = () => {
  const refresh = useRefreshChat();
  return useMutation<Awaited<ReturnType<typeof createOffer>>, AxiosError<ApiErrorResponse>, CreateOfferPayload>({
    mutationFn: createOffer,
    onSuccess: (_response, variables) => {
      refresh(variables.conversationId);
      toast.success("Offer sent");
    },
  });
};

export const useRespondOffer = (conversationId: string) => {
  const refresh = useRefreshChat();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; data: RespondOfferPayload }>({
    mutationFn: ({ id, data }) => respondOffer(id, data),
    onSuccess: (_response, variables) => {
      refresh(conversationId);
      toast.success(
        variables.data.action === "ACCEPT" ? "Offer accepted" : variables.data.action === "COUNTER" ? "Counter-offer sent" : "Offer declined"
      );
    },
    onError: (error) => toast.error(errorText(error, "Couldn't answer the offer")),
  });
};

export const useWithdrawOffer = (conversationId: string) => {
  const refresh = useRefreshChat();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: withdrawOffer,
    onSuccess: () => {
      refresh(conversationId);
      toast.success("Offer withdrawn");
    },
    onError: (error) => toast.error(errorText(error, "Couldn't withdraw the offer")),
  });
};
