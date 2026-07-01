"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  AxiosError,
} from "axios";

import toast from "react-hot-toast";

import {
  resendVerification,
} from "../services/auth.services";

interface ErrorResponse {
  message: string;
}

export const useResendVerification =
  () => {
    return useMutation({
      mutationFn:
        resendVerification,

      onSuccess: () => {
        toast.success(
          "Verification email sent"
        );
      },

      onError: (
        error:
          AxiosError<ErrorResponse>
      ) => {
        toast.error(
          error.response?.data
            .message ??
            "Something went wrong"
        );
      },
    });
  };