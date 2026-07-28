"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteAddress } from "../services/address.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address removed");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to remove address");
    },
  });
};
