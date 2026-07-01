"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { resetPassword } from "../services/auth.services";

interface ErrorResponse {
  message: string;
}

export const useResetPassword =
  () => {
    return useMutation({
      mutationFn:
        resetPassword,

      onSuccess: () => {
        toast.success(
          "Password reset successfully"
        );
      },

      onError: (
        error: AxiosError<ErrorResponse>
      ) => {
        toast.error(
          error.response?.data
            .message ??
            "Something went wrong"
        );
      },
    });
  };