"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { forgotPassword } from "../services/auth.services";

interface ErrorResponse {
  message: string;
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success("Reset email sent.");
    },

    onError: (
      error: AxiosError<ErrorResponse>
    ) => {
      toast.error(
        error.response?.data.message ??
          "Something went wrong"
      );
    },
  });
};