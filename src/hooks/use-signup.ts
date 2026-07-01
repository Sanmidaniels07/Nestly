"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { signup } from "../services/auth.services";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,

    onSuccess: (_, variables) => {
      router.push(
        `/verify-email/sent?email=${encodeURIComponent(variables.email)}`,
      );
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    },
  });
};
