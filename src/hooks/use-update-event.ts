"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateEvent } from "../services/event.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateEventPayload } from "../types/event";

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateEventPayload }
  >({
    mutationFn: ({ id, data }) => updateEvent(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update event");
    },
  });
};
