"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createEvent } from "../services/event.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { CreateEventPayload, NestlyEvent } from "../types/event";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<NestlyEvent>,
    AxiosError<ApiErrorResponse>,
    CreateEventPayload
  >({
    mutationFn: createEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to create event");
    },
  });
};
