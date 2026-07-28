"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateStore } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateStorePayload } from "../types/store";

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateStorePayload }
  >({
    mutationFn: ({ id, data }) => updateStore(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", "me"] });
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Store updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update store");
    },
  });
};
