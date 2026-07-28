"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { cancelRsvp, rsvpEvent } from "../services/event.services";
import { ApiErrorResponse } from "../types/api";
import { RsvpStatus } from "../types/event";

export const useRsvpEvent = (
  eventId: string,
  initialStatus: RsvpStatus | null
) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RsvpStatus | null>(initialStatus);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["event-attendees", eventId] });
  };

  const rsvp = useMutation<unknown, AxiosError<ApiErrorResponse>, RsvpStatus>({
    mutationFn: (nextStatus) => rsvpEvent(eventId, nextStatus),
    onSuccess: (_data, nextStatus) => {
      setStatus(nextStatus);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to RSVP");
    },
  });

  const cancel = useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => cancelRsvp(eventId),
    onSuccess: () => {
      setStatus(null);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to cancel RSVP");
    },
  });

  return {
    status,
    setGoing: () => rsvp.mutate("GOING"),
    setInterested: () => rsvp.mutate("INTERESTED"),
    cancelRsvp: () => cancel.mutate(),
    isUpdating: rsvp.isPending || cancel.isPending,
  };
};
