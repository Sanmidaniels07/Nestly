"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateReturnRequestStatus } from "../services/return-request.services";
import { ApiErrorResponse } from "../types/api";
import { ReturnRequestStatus } from "../types/return-request";

export const useUpdateReturnRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; status: ReturnRequestStatus }
  >({
    mutationFn: ({ id, status }) => updateReturnRequestStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      toast.success("Return request updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update return request");
    },
  });
};
