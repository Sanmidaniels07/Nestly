"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  AxiosError,
} from "axios";

import toast from "react-hot-toast";

import {
  verifyEmail,
} from "../services/auth.services";

interface ErrorResponse {
  message: string;
}

export const useVerifyEmail =
  () => {
    return useMutation({
      mutationFn:
        verifyEmail,

      onSuccess: () => {
        toast.success(
          "Email verified successfully"
        );
      },

      onError: (
        error:
          AxiosError<ErrorResponse>
      ) => {
        toast.error(
          error.response?.data
            .message ??
            "Verification failed"
        );
      },
    });
  };