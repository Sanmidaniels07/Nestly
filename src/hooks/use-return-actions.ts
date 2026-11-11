"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import {
  buyerReturnAction,
  decideReturnRequest,
  getAdminReturnRequests,
  respondToReturnRequest,
} from "../services/return-request.services";
import { ApiErrorResponse } from "../types/api";
import { BuyerReturnAction, ReturnDecision, ReturnRequestListParams, SellerReturnAction } from "../types/return-request";

// Every answer changes the seller's earnings too (payouts on hold / released).
const useInvalidate = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["returns"] });
    queryClient.invalidateQueries({ queryKey: ["payouts"] });
  };
};

const errorText = (error: AxiosError<ApiErrorResponse>, fallback: string) => error.response?.data.message ?? fallback;

const SELLER_DONE: Record<SellerReturnAction, string> = {
  REFUND: "Refund sent to the buyer",
  REPLACE: "The buyer knows a replacement is coming",
  DISAGREE: "Sent to Nestly to decide",
};

export const useRespondToReturn = () => {
  const invalidate = useInvalidate();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; action: SellerReturnAction; note?: string }>({
    mutationFn: ({ id, action, note }) => respondToReturnRequest(id, action, note),
    onSuccess: (_data, { action }) => {
      invalidate();
      toast.success(SELLER_DONE[action]);
    },
    onError: (error) => toast.error(errorText(error, "Couldn't send your answer")),
  });
};

const BUYER_DONE: Record<BuyerReturnAction, string> = {
  KEEP: "Report closed - enjoy your item",
  REPLACEMENT_RECEIVED: "Thanks - report closed",
  REPLACEMENT_PROBLEM: "Sent to Nestly to decide",
};

export const useBuyerReturnAction = () => {
  const invalidate = useInvalidate();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; action: BuyerReturnAction; note?: string }>({
    mutationFn: ({ id, action, note }) => buyerReturnAction(id, action, note),
    onSuccess: (_data, { action }) => {
      invalidate();
      toast.success(BUYER_DONE[action]);
    },
    onError: (error) => toast.error(errorText(error, "Couldn't update your report")),
  });
};

export const useAdminReturnRequests = (params: ReturnRequestListParams = {}) =>
  useQuery({
    queryKey: ["returns", "admin", params],
    queryFn: () => getAdminReturnRequests(params),
    select: (response) => response.data,
  });

export const useDecideReturn = () => {
  const invalidate = useInvalidate();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; decision: ReturnDecision; note?: string }>({
    mutationFn: ({ id, decision, note }) => decideReturnRequest(id, decision, note),
    onSuccess: (_data, { decision }) => {
      invalidate();
      toast.success(decision === "REFUND" ? "Buyer refunded" : "Closed in the seller's favour");
    },
    onError: (error) => toast.error(errorText(error, "Couldn't save the decision")),
  });
};
