"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createStore } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";
import { CreateStorePayload } from "../types/store";

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateStorePayload>({
    mutationFn: createStore,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "me"] });
      queryClient.invalidateQueries({ queryKey: ["store", "me"] });
      toast.success("Store created");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to create store");
    },
  });
};
