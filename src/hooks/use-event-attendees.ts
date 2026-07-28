"use client";

import { useQuery } from "@tanstack/react-query";

import { getEventAttendees } from "../services/event.services";

export const useEventAttendees = (
  id: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["event-attendees", id, params],
    queryFn: () => getEventAttendees(id, params),
    select: (response) => response.data,
    enabled: !!id,
  });
};
