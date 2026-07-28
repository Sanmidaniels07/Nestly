"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createReturnRequest } from "../services/return-request.services";
import { ApiErrorResponse } from "../types/api";
import { CreateReturnRequestPayload } from "../types/return-request";

export const useCreateReturnRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateReturnRequestPayload>({
    mutationFn: createReturnRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      toast.success("Return request submitted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to submit return request");
    },
  });
};
