"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createAddress } from "../services/address.services";
import { ApiErrorResponse } from "../types/api";
import { CreateAddressPayload } from "../types/address";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateAddressPayload>({
    mutationFn: createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to add address");
    },
  });
};
