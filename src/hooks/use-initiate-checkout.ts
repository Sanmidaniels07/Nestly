"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { initiateCheckout } from "../services/checkout.services";
import { ApiErrorResponse } from "../types/api";
import { InitiateCheckoutPayload } from "../types/checkout";

export const useInitiateCheckout = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, InitiateCheckoutPayload>({
    mutationFn: initiateCheckout,

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to start checkout");
    },
  });
};
