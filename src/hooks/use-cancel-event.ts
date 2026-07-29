"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { cancelEvent } from "../services/event.services";
import { ApiErrorResponse } from "../types/api";

export const useCancelEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: cancelEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event cancelled");
      router.push("/events");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to cancel event");
    },
  });
};
