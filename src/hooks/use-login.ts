"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.services";

export const useLogin =
  () => {
    return useMutation({
      mutationFn:
        login,
    });
  };